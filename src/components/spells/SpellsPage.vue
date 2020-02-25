<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div>
    <SpellsToolbar :app="app" :class="panelIsOpen ? 'd-none d-md-flex' : ''" :query="query" :selectedSpell="selectedSpell" :detailedModeOn="detailedModeOn" @toggle-detailed-view="toggleDetailedView" @select-spell="s => { selectedSpell = s }"/>
    <div class="row">
      <div :class="detailedModeOn ? (panelIsOpen ? 'd-none' : 'd-block col-12') : (panelIsOpen ? 'col-md-6 col-lg-4 col-xl-3 d-none d-md-block' : 'col-12')">
        <SpellList :app="app" :query="query" :panelIsOpen="panelIsOpen" :selectedSpell="selectedSpell" :detailedModeOn="detailedModeOn" @spell-clicked="openSpell"/>
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
import constants from '@/util/constants.js';

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
    }
  },
  methods: {
    openSpell(key) {
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
    // Load the latest version of the SRD into the content database
    updateSRD() {
      try {
        this.app.contentDatabase.loadURL('/srd.json',
          () => this.app.reloadDatabase(),
          err => this.showError(err)
        );
      } catch (err) {
        this.showError(err);
      }
    }
  },
  created() {
    // Redirect to import page if there is no database loaded
    if (this.app.spells.length == 0) {
      this.$router.push('/welcome');
    }
    // If the URL contains a spell, display it
    this.loadSpellInURL();
    // If an updated version of the SRD content is available, load it immediately
    if (this.app.contentDatabase.data.sources.some(s => s.name == 'SRD 5.1' && s.version < constants.srdVersion)) {
      this.updateSRD();
    }
  },
  watch: {
    '$route': function() {
      this.loadSpellInURL();
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
