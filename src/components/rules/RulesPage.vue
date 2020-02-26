<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->
<template>
  <div>
    <RuleSearcher :app="app" :class="panelIsOpen ? 'd-none d-md-flex' : ''" :query="query"/>
    <div class="row">
      <div :class="panelIsOpen ? 'col-md-6 col-lg-4 col-xl-3 d-none d-md-block' : 'col-12'">
        <RuleList :app="app" :query="query" :panelIsOpen="panelIsOpen" :selectedRule="selectedRule" @rule-clicked="openRule"/>
      </div>
      <RuleView :app="app" v-if="panelIsOpen" :rule="selectedRule" @clear-rule="clearRule" class="col-md-6 col-lg-8 col-xl-9 scrollable-panel rule-view"/>
    </div>
  </div>
</template>

<script>
import RuleList from './RuleList.vue';
import RuleSearcher from './RuleSearcher.vue';
import RuleView from './RuleView.vue';
import constants from '@/util/constants.js';

export default {
  name: 'RulesPage',
  components: {
    RuleList,
    RuleSearcher,
    RuleView
  },
  props: {
    app: Object,
    urlRuleName: String
  },
  data() { return {
    query: { text: '', level: "", class: "", school: "", includeDescription: false, favorites: false },
    selectedRule: null,
    detailedModeOn: false
  }},
  computed: {
    // True if a rule's detailed view is open
    panelIsOpen() {
      return this.selectedRule != null;
    },
    // Determines whether the user's content database contains an outdated version of the SRD database
    updateAvailable() {
      return this.app.contentDatabase.data.sources.some(s =>
        s.name == 'SRD 5.1' && (s.version < constants.srdVersion || typeof(s.version) != "number")
      );
    }
  },
  methods: {
    openRule(key) {
      // Save the currently opened rule in the URL. This has two benefits:
      // - Each rule can be directly accessed by its own URL
      // - Going back in history takes us back to the rule we were before, or to the list if none. This is essential in mobile so that the back button doesn't make us leave the rules page, but return to the list.
      this.$router.push('/rules/' + key);
    },
    clearRule() {
      this.$router.push('/rules');
    },
    toggleDetailedView() {
      this.detailedModeOn = !this.detailedModeOn;
      if (this.detailedModeOn) {
        this.clearRule();
      }
    },
    loadRuleInURL() {
      if (this.urlRuleName) {
        this.selectedRule = this.app.rules.find(s => s.codename == this.urlRuleName);
      } else {
        this.selectedRule = null;
      }
    }
  },
  created() {
    this.loadRuleInURL();
  },
  watch: {
    '$route': function() {
      this.loadRuleInURL();
    }
  }
}
</script>

<style>
  .rules, .rule-view {
    max-height: calc(100vh - 90px);
  }
  @media(max-width: 768px) {
    .rule-view {
      max-height: calc(100vh - 50px);
    }
  }
</style>
