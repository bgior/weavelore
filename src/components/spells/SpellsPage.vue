<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div>
    <SpellSearcher :app="app" :class="panelIsOpen ? 'd-none d-md-flex' : ''" :query="query" :detailedModeOn="detailedModeOn" @toggleDetailedView="toggleDetailedView"/>
    <div class="row results">
      <div :class="detailedModeOn ? (panelIsOpen ? 'd-none' : 'd-block col-12') : (panelIsOpen ? 'col-md-6 col-lg-4 d-none d-md-block' : 'col-12')">
        <SpellList :app="app" :query="query" :panelIsOpen="panelIsOpen" :selectedSpell="selectedSpell" :detailedModeOn="detailedModeOn" @spell-clicked="openSpell" class="scrollable-panel spell-list"/>
      </div>
      <SpellView :app="app" v-if="panelIsOpen" :spell="selectedSpell" @clear-spell="clearSpell" :class="`${detailedModeOn ? 'col-12' : 'col-md-6 col-lg-8'} scrollable-panel spell-view`"/>
    </div>
    <div v-if="updateAvailable" class="update-notice" @click="$router.push('/welcome?action=updateSRD')">
      <img :src="require('@/assets/images/icons/misc/sync.png')" style="width: 18px"/> Updated content is available. Click here to load.
    </div>
  </div>
</template>

<script>
import SpellList from './SpellList.vue';
import SpellSearcher from './SpellSearcher.vue';
import SpellView from './SpellView.vue';
import constants from '@/util/constants.js';

export default {
  name: 'SpellsPage',
  components: {
    SpellList,
    SpellSearcher,
    SpellView
  },
  props: {
    app: Object,
    urlSpellName: String
  },
  data() { return {
    query: { text: '', level: "", class: "", school: "", includeDescription: false, favorites: false },
    selectedSpell: null,
    detailedModeOn: false
  }},
  computed: {
    // True if a spell's detailed view is open
    panelIsOpen() {
      return this.selectedSpell != null;
    },
    // Determines whether the user's content database contains an outdated version of the SRD database
    updateAvailable() {
      return this.app.contentDatabase.data.sources.some(s =>
        s.name == 'SRD 5.1' && (s.version < constants.srdVersion || typeof(s.version) != "number")
      );
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
    }
  },
  created() {
    // Redirect to import page if there is no database loaded
    if (this.app.spells.length == 0) {
      this.$router.push('/welcome');
    }
    this.loadSpellInURL();
  },
  watch: {
    '$route': function() {
      this.loadSpellInURL();
    }
  }
}
</script>

<style>
  .scrollable-panel {
    max-height: calc(100vh - 90px);
    overflow-y: scroll;
    scrollbar-color: #282828 #1b1b1b;
  }
  @media(max-width: 768px) {
    /* On mobile, the spell list is further down because the search filters take up two rows instead of one */
    .spell-list {
      max-height: calc(100vh - 130px);
    }
    /* On mobile, the spell view takes up the whole screen (except navbar), without having the search bar above */
    .spell-view {
      max-height: calc(100vh - 50px);
    }
  }
  .update-notice {
    position: fixed;
    bottom: 0;
    background-color: #264c66;
    width: 100%;
    margin-left: -15px;
    padding: 5px;
    border-top: 3px solid #3877a2;
    text-align: center;
    cursor: pointer;
  }
</style>
