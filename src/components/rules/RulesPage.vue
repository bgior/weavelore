<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div>
    <RuleSearcher :app="app" :class="panelIsOpen ? 'd-none d-md-flex' : ''" :query="query" @navigate-rules="navigateRules"/>
    <div class="row">
      <div :class="panelIsOpen ? 'col-md-6 col-lg-4 col-xl-3 d-none d-md-block' : 'col-12'">
        <RuleList v-if="queryPresent" :rules="filteredRules" :panelIsOpen="panelIsOpen" :selectedRule="selectedRule" @rule-clicked="openRule"/>
        <div v-else class="list-message">Type anything to search</div>
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
    // The list of rules that match the user's query
    filteredRules() {
      const query = this.query;
      return this.app.rules.filter(rule => query.text.length >= this.app.settings.minimumQueryLength &&
        (rule.downcasedName.includes(query.text) || (rule.tags && rule.tags.some(t => t.includes(query.text))) ||
        (query.includeDescription && rule.description.toLowerCase().includes(query.text)))
      );
    },
    // Returns whether the user has entered any valid query
    queryPresent() {
      return this.query.text.length >= this.app.settings.minimumQueryLength || this.query.class || this.query.level || this.query.school;
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
      if (this.selectedRule && this.selectedRule.codename == key) { // Do nothing if the rule is already selected
        return;
      }
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
    },
    // Allow the user to navigate through the rule list using the arrow keys
    navigateRules(direction) {
      const indexOfTheCurrentRule = this.filteredRules.indexOf(this.selectedRule);
      if (direction == 'up') {
        if (indexOfTheCurrentRule > 0) {
          this.openRule(this.filteredRules[indexOfTheCurrentRule - 1].codename);
        }
      } else {
        if (indexOfTheCurrentRule < this.filteredRules.length - 1) {
          this.openRule(this.filteredRules[indexOfTheCurrentRule + 1].codename);
        }
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
  },
  metaInfo() {
    if (this.selectedRule) {
      const ruleDescriptionWithoutHTML = this.selectedRule.description.replace(/<\/?[^>]+>/g, '');
      return {
        title: this.selectedRule.name + " - WeaveLore",
        meta: [
          {
            vmid: "description",
            name: "description",
            content: ruleDescriptionWithoutHTML.length > 300 ? ruleDescriptionWithoutHTML.substring(0, 300) + '...' : ruleDescriptionWithoutHTML
          }
        ]
      }
    } else {
      return {
        title: "Rules - Weavelore",
        meta: [
          { vmid: "description", name: "description", content: "Browse a list of rules taken from the D&D 5e SRD (System Reference Document), or add your own rules and notes." }
        ]
      }
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
