// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

// A SettingsDatabase abstracts concerns like persistence and loading related to
// settings data (like config and favorites).
class SettingsDatabase {
  constructor(settingsJSON) {
    if (!settingsJSON) {
      throw "Attempted to initialize a settings database without data";
    }
    this.data = settingsJSON;
  }
  getSettings() {
    return this.data;
  }
  saveToStorage() {
    try {
      const convertedData = Object.assign({}, this.data); // Clone so that the original settings aren't modified
      convertedData.favorites = Array.from(convertedData.favorites); // Convert the Set to Array so that it can be serialized
      window.localStorage.settings = JSON.stringify(convertedData);
      return true;
    } catch (ex) {
      throw "Failed to persist settings due to the following exception: " + ex.message;
    }
  }
  deleteFromStorage() {
    window.localStorage.removeItem("settings");
  }
  // Load the user settings from local storage. If there are none, or they fail to be loaded, return default settings instead.
  static getFromStorageOrDefault() {
    let settingsJSON = null;
    try {
      settingsJSON = JSON.parse(window.localStorage.settings);
    } catch (e) {}
    const defaults = this.getDefaultSettings();
    if (settingsJSON && typeof(settingsJSON) == "object") {
      settingsJSON = Object.assign(defaults, settingsJSON); // Let the default settings fill any missing element in the persisted hash, in case we add settings in future versions.
    } else {
      settingsJSON = defaults;
    }
    settingsJSON.favorites = new Set(settingsJSON.favorites); // Convert the Array to Set for faster lookups
    return new SettingsDatabase(settingsJSON);
  }
  // Get a predefined hash of default settings, different for mobile and desktop browsers
  static getDefaultSettings() {
    if (navigator.userAgent.includes("Mobile")) {
      return {
        minimumQueryLength: 3,
        favorites: []
      }
    } else {
      return {
        minimumQueryLength: 0,
        favorites: []
      }
    }
  }
}
export default SettingsDatabase;
