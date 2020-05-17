<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<!-- This component manages the section of the SpellsToolbar dedicated to spell edition-related functions. -->
<template>
  <span>
    <span v-if="app.editionModeOn" @click="addNewSpell()">
      <img src="@/assets/images/icons/misc/addSpell.png" class="details-icon" title="Add a new blank spell" alt=""/>
    </span>
    <span v-if="app.editionModeOn" @click="deleteSpell()">
      <img src="@/assets/images/icons/misc/deleteSpell.png" :class="{ 'details-icon': true, disabled: !selectedSpell }" title="Delete the currently selected spell" alt=""/>
    </span>
    <span v-if="app.editionModeOn" @click="validateAndSave()">
      <img src="@/assets/images/icons/misc/save1.png" class="details-icon" title="Save changes" alt=""/>
    </span>
    <span @click="app.editionModeOn = !app.editionModeOn">
      <img src="@/assets/images/icons/misc/edition.png" :class="{ 'details-icon': true, active: app.editionModeOn }" title="Toggle spell edition mode" alt=""/>
    </span>
  </span>
</template>

<script>
const newSpellTemplate = {
  name: "New spell",
  classes: [],
  school: "divination",
  level: 0,
  range: "",
  duration: "",
  casting: "",
  verbal: false,
  somatic: false,
  material: 0,
  materials: null,
  concentration: false,
  ritual: false,
  description: "",
  atHigherLevel: null
};

export default {
  name: 'SpellEditionControls',
  props: {
    app: Object,
    selectedSpell: Object
  },
  methods: {
    validateAndSave() {
      try {
        this.app.contentDatabase.validate();
        this.app.contentDatabase.saveToStorage();
      } catch (error) {
        if (error.message) {
          this.app.alert("Validation error: " + error.message);
        }
        return;
      }
      this.app.alert("Content saved", "success");
    },
    // Add a new spell for the user to fill in
    addNewSpell() {
      const newSpell = {};
      Object.assign(newSpell, newSpellTemplate); // Clone the new spell hash to prevent modification
      let defaultSource = this.app.contentDatabase.data.sources.find(s => s.name == "Unassigned");
      if (!defaultSource) {
        defaultSource = {
          name: "Unassigned",
          description: "Spells you created through the editor.",
          version: 0,
          spells: [],
          rules: []
        };
        this.app.contentDatabase.data.sources.push(defaultSource);
      }
      // If a spell named "New spell" already exists, append numbers until necessary
      while(this.app.spells.some(s => s.name == newSpell.name)) {
        const number = (newSpell.name.match(/ (\d+)$/) || [])[1]; // Grab the number from the current spell name
        if (number) {
          newSpell.name = "New spell " + (parseInt(number) + 1);
        } else {
          newSpell.name = "New spell 2";
        }
      }
      this.app.contentDatabase.addSpell(newSpell, defaultSource.name);
      this.app.reloadDatabase();
      // Notify SpellView to open the newly created spell
      this.$emit("select-spell", newSpell);
    },
    // Delete the currently selected spell from the database
    deleteSpell() {
      if (this.selectedSpell) {
        if (confirm(`Delete spell "${this.selectedSpell.name}"?`)) {
          this.app.contentDatabase.deleteSpell(this.selectedSpell);
          this.app.reloadDatabase();
          this.$emit("select-spell", null);
        }
      }
    }
  }
}
</script>
