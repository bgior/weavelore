<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div>
    <div class="row rules scrollable-panel" v-if="rules.length > 0">
      <div v-for="r in rules" :key="r.codename" :class="`rule col-12 ${panelIsOpen ? (r.codename == selectedRule.codename ? 'selected' : '') : 'col-md-6 col-lg-4 col-xl-3'}`" @click="ruleClicked($event, r.codename)">
        <img :src="require(`@/assets/images/icons/rules/${r.icon}.png`)" alt="">
        {{ r.name }}
      </div>
    </div>
    <div v-else class="list-message">
      No rules found
    </div>
  </div>
</template>

<script>
import Icons from '@/util/icons.js';
import constants from '@/util/constants.js';

export default {
  name: 'RuleList',
  props: {
    app: Object,
    rules: Array,
    panelIsOpen: Boolean,
    selectedRule: Object
  },
  computed: {
    icons() {
      return Icons;
    },
    classes() {
      return constants.classes;
    }
  },
  methods: {
    ruleClicked(event, key) {
      if (!this.selectedRule) {
        const div = event.currentTarget;
        setTimeout(() => div.scrollIntoView({behavior: "smooth", block: "center"}), 100);
      }
      this.$emit("rule-clicked", key);
    }
  }
}
</script>

<style>
  .rules {
    padding: 3px;
    font-size: 16px;
    line-height: 1;
    color: #eee;
  }
  .rule {
    text-align: left;
    background-color: #212020;
    border: 2px solid #1b1b1b;
    border-radius: 4px;
    padding: 2px 6px !important;
    cursor: pointer;
    overflow-y: hidden;
    height: 34px;
    line-height: 20px;
  }
  .rule img {
    height: 26px;
    filter: brightness(0.5);
  }
  .rule:hover, .rule.selected {
    background-color: #272727;
    border-color: #212121;
  }
  .rule:hover img, .rule.selected img {
    transform: scale(1.05);
    filter: brightness(1.0);
  }
  @media(max-width: 767px) {
    .rules { font-size: 18px; }
  }
</style>
