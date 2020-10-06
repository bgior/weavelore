// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

import Validator from '@/util/contentDatabaseValidator.js';

// A ContentDatabase abstracts concerns like persistence and loading related to
// content data (like spells and rules).
class ContentDatabase {

  constructor(contentJSON, runValidations = true) {
    this.data = getBlankData();
    this.loadJSON(contentJSON, runValidations);
  }
  // Returns true if the database has at least one source
  isEmpty() {
    return this.data.sources.length == 0;
  }
  // Returns an array of all spells contained, sorted alphabetically
  getSpells() {
    const spells = [];
    for (let source of this.data.sources) {
      for (let spell of source.spells) {
        spells.push(spell);
      }
    }
    return spells.sort((a,b) => {
      return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
    });
  }
  getRules() {
    const rules = [];
    for (let source of this.data.sources) {
      for (let rule of source.rules) {
        rules.push(rule);
      }
    }
    return rules.sort((a,b) => {
      return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
    });
  }
  // Imports a JSON object into the database and persists it
  loadJSON(contentJSON, runValidations = true) {
    if (!contentJSON) {
      throw "Attempted to load an empty JSON into a content database";
    }
    if (runValidations) {
      Validator.validate(contentJSON);
    }
    // Merge the sources in the JSON file with those already present. An existing
    // source is replaced with one in the JSON if the new source has a higher or
    // equal version number.
    for (let newSource of contentJSON.sources) {
      const existingSource = this.data.sources.find(s => s.name == newSource.name);
      if (existingSource) {
        if (existingSource.version > newSource.version) {
          console.log(`Ignoring ${newSource.name} v${newSource.version} because newer version v${existingSource.version} is loaded.`);
        } else {
          // Replace the older source with the updated one
          this.data.sources.splice(this.data.sources.indexOf(existingSource), 1);
          this.addSource(newSource);
        }
      } else {
        this.addSource(newSource);
      }
    }
    this.saveToStorage();
  }
  // Fetch a JSON from a URL and then load it
  loadURL(url) {
    return new Promise((resolve, reject) => {
      fetch(url).then(res => res.json()).then(json => {
        try {
          this.loadJSON(json);
          resolve();
        } catch (e) {
          reject("Failed to import database fetched from URL, see console for details.");
          console.error(e);
        }
      }).catch(error => {
        reject("Failed to fetch database from URL, see console for details.");
        console.error(error);
      });
    });
  }
  // Add a new source to the database
  addSource(source) {
    source.spells.forEach(s => this.fillAutocalculatedFields(s, source.name));
    source.rules.forEach(r => this.fillAutocalculatedFields(r, source.name));
    this.data.sources.push(source);
  }
  // Delete a source from the database
  deleteSource(source) {
    this.data.sources.splice(this.data.sources.indexOf(source), 1);
    this.saveToStorage();
  }
  // Delete all sources from the database
  deleteAllSources() {
    this.data = getBlankData();
    this.saveToStorage();
  }
  // Add a new spell to the database under the given source
  addSpell(spell, sourceName) {
    this.fillAutocalculatedFields(spell, sourceName);
    const source = this.data.sources.find(s => s.name == sourceName);
    if (source) {
      source.spells.push(spell);
    } else {
      throw "Called ContentDatabase.addSpell with a sourceName that does not exist";
    }
  }
  // Delete a spell from the database
  deleteSpell(spell) {
    const source = this.data.sources.find(s => s.name == spell.sourceName);
    if (!source) throw `Cannot delete spell ${spell.name} because source ${spell.sourceName} does not exist.`;
    const index = source.spells.indexOf(spell);
    if (index < 0) throw `Cannot delete spell ${spell.name} because source ${spell.sourceName} does not contain it.`;
    source.spells.splice(index, 1);
  }
  // Given a spell whose sourceName was changed, remove it from its original source and add it to the new one to reflect that change
  relocateSpell(spell) {
    const originalSource = this.data.sources.find(src => src.spells.includes(spell));
    if (!originalSource) throw `Cannot delete spell ${spell.name} because no source contains it.`;
    const targetSource = this.data.sources.find(s => s.name == spell.sourceName);
    const index = originalSource.spells.indexOf(spell);
    originalSource.spells.splice(index, 1);
    targetSource.spells.push(spell);
  }
  // Given either a spell or a rule, set the autocalculated fields values
  fillAutocalculatedFields(entity, sourceName) {
    entity.sourceName = sourceName;
    entity.downcasedName = entity.name.toLowerCase(); // Used to search
    entity.codename = entity.downcasedName.replace(/[/ ]/g, '-'); // Used as an identificator for the spell (friendlier to URLs and such)
  }
  // Persist this database in the browser's LocalStorage
  saveToStorage() {
    try {
      window.localStorage.content = JSON.stringify(this.data);
      return true;
    } catch (ex) {
      throw "Failed to persist content due to the following exception: " + ex.message;
    }
  }
  // Generate a JSON string that can be written into a WLC file. If a source name is given
  // it exports that source only. Otherwise it exports the entire database.
  export(sourceName = null) {
    var clonedData = JSON.parse(JSON.stringify(this.data)); // Deep clone the database so that we can modify the copy
    // If a source was specified, remove all other sources from the export
    if (sourceName) {
      clonedData.sources = clonedData.sources.filter(s => s.name == sourceName);
    }
    // Remove the autogenerated fields from each spell and rule
    for (let source of clonedData.sources) {
      for (let spell of source.spells) {
        delete spell.downcasedName;
        delete spell.codename;
        delete spell.sourceName;
      }
      for (let rule of source.rules) {
        delete rule.downcasedName;
        delete rule.codename;
        delete rule.sourceName;
      }
    }
    return JSON.stringify(clonedData);
  }
  // Raise an exception if there's any issue with the database contents
  validate() {
    Validator.validate(this.data);
  }
  // Get the ContentDatabase persisted in LocalStorage, or if absent/invalid, a default one
  static getFromStorageOrBlank() {
    try {
      if (window.localStorage.content) {
        let contentJSON = JSON.parse(window.localStorage.content);
        if (contentJSON.sources) {
          // Load the previously stored local database without running validations
          return new ContentDatabase(contentJSON, false);
        }
      }
    } catch (e) {
      console.error("Couldn't load the local database, using default instead. Reason: " + JSON.stringify(e));
    }
    return this.getBlank();
  }
  // Get an empty database with no sources
  static getBlank() {
    return new ContentDatabase(getBlankData());
  }
}
// Get a JSON representing a blank database
function getBlankData() {
  return {
    format: "WLC",
    formatVersion: "0.2.0",
    sources: []
  }
}

export default ContentDatabase;
