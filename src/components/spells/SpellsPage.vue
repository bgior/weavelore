<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div>
    <SpellsToolbar :app="app" :class="panelIsOpen ? 'd-none d-md-flex' : ''" :query="query" :selectedSpell="selectedSpell" :detailedModeOn="detailedModeOn" @toggle-detailed-view="toggleDetailedView" @navigate-spells="navigateSpells" @select-spell="s => { selectedSpell = s }"/>
    <div class="row">
      <div :class="detailedModeOn ? (panelIsOpen ? 'd-none' : 'd-block col-12') : (panelIsOpen ? 'col-md-6 col-lg-4 col-xl-3 d-none d-md-block' : 'col-12')">
        <SpellList v-if="queryPresent" :app="app" :spells="filteredSpells" :panelIsOpen="panelIsOpen" :selectedSpell="selectedSpell" :detailedModeOn="detailedModeOn" @spell-clicked="openSpell"/>
        <div v-else class="list-message">Type anything to search</div>
      </div>
      <template v-if="selectedSpell">
        <SpellEditor v-if="app.editionModeOn" :app="app" :spell="selectedSpell" :class="`${detailedModeOn ? 'col-12' : 'col-md-6 col-lg-8 col-xl-9'} scrollable-panel`"/>
        <SpellView v-else :app="app" :spell="selectedSpell" @clear-spell="clearSpell" :class="`${detailedModeOn ? 'col-12' : 'col-md-6 col-lg-8 col-xl-9'} scrollable-panel`"/>
      </template>
    </div>
  </div>
</template>

<script>
import SpellList from './SpellList.vue';
import SpellsToolbar from './SpellsToolbar.vue';
import SpellView from './SpellView.vue';
import SpellEditor from './SpellEditor.vue';

export default {
  name: 'SpellsPage',
  components: {
    SpellList,
    SpellsToolbar,
    SpellView,
    SpellEditor
  },
  props: {
    app: Object,
    urlSpellName: String
  },
  data() { return {
    query: { text: '', level: "", class: "", school: "", sourceName: "", includeDescription: false, favorites: false },
    selectedSpell: null,
    detailedModeOn: false
  }},
  computed: {
    // True if a spell's detailed view is open
    panelIsOpen() {
      return this.selectedSpell != null;
    },
    // The list of spells that match the user's query
    filteredSpells() {
      if (this.queryPresent) {
        return this.app.spells.filter(spell => {
          if (this.query.class || this.query.level || this.query.school || this.query.sourceName || this.query.favorites) {
            // Composite search (with filters)
            return (spell.codename.includes(this.query.text) || (this.query.includeDescription && spell.description.includes(this.query.text))) &&
              (!this.query.class || spell.classes.includes(this.query.class)) &&
              (!this.query.level || spell.level == this.query.level) &&
              (!this.query.school || spell.school == this.query.school) &&
              (!this.query.sourceName || spell.sourceName == this.query.sourceName) &&
              (!this.query.favorites || this.app.settings.favorites.has(spell.codename));
          } else {
            // Simple search (no filters)
            return this.query.text.length >= this.app.settings.minimumQueryLength && (spell.downcasedName.includes(this.query.text) || (this.query.includeDescription && spell.description.toLowerCase().includes(this.query.text)));
          }
        });
      } else {
        return [];
      }
    },
    // Returns whether the user has entered any valid query
    queryPresent() {
      return this.query.text.length >= this.app.settings.minimumQueryLength || this.query.class || this.query.level || this.query.school || this.query.sourceName;
    }
  },
  methods: {
    openSpell(key) {
      if (this.selectedSpell && this.selectedSpell.codename == key) { // Do nothing if the spell is already selected
        return;
      }
      // Save the currently opened spell in the URL. This has two benefits:
      // - Each spell can be directly accessed by its own URL
      // - Going back in history takes us back to the spell we were before, or to the list if none. This is essential in mobile so that the back button doesn't make us leave the spells page, but return to the list.
      this.$router.push('/spells/' + key);
    },
    clearSpell() {
      this.$router.push('/spells');
    },
    toggleDetailedView() {
      this.detailedModeOn = !this.detailedModeOn;
      if (this.detailedModeOn) {
        this.clearSpell();
      }
    },
    loadSpellInURL() {
      if (this.urlSpellName) {
        this.selectedSpell = this.app.spells.find(s => s.codename == this.urlSpellName);
      } else {
        this.selectedSpell = null;
      }
    },
    // Allow the user to navigate through the spell list using the arrow keys
    navigateSpells(direction) {
      const indexOfTheCurrentSpell = this.filteredSpells.indexOf(this.selectedSpell);
      if (direction == 'up') {
        if (indexOfTheCurrentSpell > 0) {
          this.openSpell(this.filteredSpells[indexOfTheCurrentSpell - 1].codename);
        }
      } else {
        if (indexOfTheCurrentSpell < this.filteredSpells.length - 1) {
          this.openSpell(this.filteredSpells[indexOfTheCurrentSpell + 1].codename);
        }
      }
    }
  },
  created() {
    // If the URL contains a spell, display it
    this.loadSpellInURL();
  },
  watch: {
    '$route': function() {
      this.loadSpellInURL();
    }
  },
  metaInfo() {
    if (this.selectedSpell) {
      const spellDescriptionWithoutHTML = this.selectedSpell.description.replace(/<\/?[^>]+>/g, '');
      return {
        title: this.selectedSpell.name + " - WeaveLore",
        meta: [
          {
            vmid: "description",
            name: "description",
            content: spellDescriptionWithoutHTML.length > 300 ? spellDescriptionWithoutHTML.substring(0, 300) + '...' : spellDescriptionWithoutHTML
          }
        ]
      }
    } else {
      return {}; // Use the default data defined in App.vue
    }
  }
}
</script>

<style>
  .spells {
    max-height: calc(100vh - 90px);
  }
  .spell-details, .spell-editor {
    height: calc(100vh - 90px);
  }
  @media(max-width: 767px) {
    /* On mobile, the spell list is further down because the search filters take up two rows instead of one */
    .spells {
      max-height: calc(100vh - 130px);
    }
    /* On mobile, the spell view takes up the whole screen (except navbar), without having the search bar above */
    .spell-details, .spell-editor {
      height: calc(100vh - 50px);
    }
  }
  @media(min-width: 768px) and (max-width: 991px) {
    .spells {
      max-height: calc(100vh - 130px);
    }
    .spell-details, .spell-editor {
      height: calc(100vh - 130px);
    }
  }
</style>
