// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

// A ContentDatabase abstracts concerns like persistence and loading related to
// content data (like spells and rules).
class ContentDatabase {
  constructor(contentJSON) {
    this.loadJSON(contentJSON);
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
    return spells;
  }
  loadJSON(contentJSON) {
    if (!contentJSON) {
      throw "Attempted to load an empty JSON into a content database";
    }
    if (contentJSON.format != "WLC") {
      console.log(contentJSON);
      throw "Attempted to load a JSON with invalid format into a content database (format != WLC)"
    }
    this.data = contentJSON;
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
  saveToStorage() {
    try {
      window.localStorage.content = JSON.stringify(this.data);
      return true;
    } catch (ex) {
      throw "Failed to persist content due to the following exception: " + ex.message;
    }
  }
  deleteFromStorage() {
    window.localStorage.removeItem("content");
  }
  static getFromStorageOrDefault() {
    try {
      if (window.localStorage.content) {
        let contentJSON = JSON.parse(window.localStorage.content);
        if (contentJSON && typeof(contentJSON) == "object") {
          return new ContentDatabase(contentJSON);
        }
      }
    } catch (e) {}
    return new ContentDatabase({
      format: "WLC",
      formatVersion: "0.2.0",
      sources: []
    });
  }
}
export default ContentDatabase;
