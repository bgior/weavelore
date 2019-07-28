// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

import Validator from '@/util/contentDatabaseValidator.js';

// A ContentDatabase abstracts concerns like persistence and loading related to
// content data (like spells and rules).
class ContentDatabase {

  constructor(contentJSON, runValidations = true) {
    this.data = getDefaultData();
    this.loadJSON(contentJSON, runValidations);
  }
  isEmpty() {
    return !this.data.sources.some(s => s.spells.length > 0);
  }
  getSpells() {
    const spells = [];
    for (let source of this.data.sources) {
      for (let spell of source.spells) {
        // Add calculated fields to each spell (redundant info for performance)
        spell.downcasedName = spell.name.toLowerCase(); // Used to search
        spell.codename = spell.name.toLowerCase().replace(/\//g, '-').replace(/ /g, '-'); // Used as an identificator for the spell (friendlier to URLs and such)
        spell.source = source.name;
        spells.push(spell);
      }
    }
    return spells.sort((a,b) => a.name > b.name);
  }
  loadJSON(contentJSON, runValidations = true) {
    if (!contentJSON) {
      throw "Attempted to load an empty JSON into a content database";
    }
    if (runValidations) {
      Validator.validate(contentJSON);
    }
    for (let newSource of contentJSON.sources) {
      const existingSource = this.data.sources.find(s => s.name == newSource.name);
      if (existingSource) {
        if (existingSource.version > newSource.version) {
          console.log(`Ignoring ${newSource.name} v${newSource.version} because newer version v${existingSource.version} is loaded.`);
        } else {
          // Replace the older source with the updated one
          this.data.sources.splice(this.data.sources.indexOf(existingSource))
          this.data.sources.push(newSource);
        }
      } else {
        this.data.sources.push(newSource);
      }
    }
    this.saveToStorage();
  }
  loadURL(url, onSuccess, onError = console.error) {
    const xhttp = new XMLHttpRequest();
    const self = this;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          try {
            self.loadJSON(xhttp.response);
            onSuccess();
          } catch (e) {
            onError(e);
          }
        } else {
          onError("The XHR was not successful");
        }
      }
    };
    xhttp.responseType = 'json';
    xhttp.open("GET", url, true);
    xhttp.send();
  }
  deleteSource(source) {
    this.data.sources.splice(this.data.sources.indexOf(source), 1);
    this.saveToStorage();
  }
  deleteAllSources() {
    this.data = getDefaultData();
    this.saveToStorage();
  }
  saveToStorage() {
    try {
      window.localStorage.content = JSON.stringify(this.data);
      return true;
    } catch (ex) {
      throw "Failed to persist content due to the following exception: " + ex.message;
    }
  }
  static getFromStorageOrDefault() {
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
    return new ContentDatabase(getDefaultData());
  }
}

function getDefaultData() {
  return {
    format: "WLC",
    formatVersion: "0.2.0",
    sources: []
  }
}

export default ContentDatabase;
