<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="rule-details">
    <div class="rule-head">
      <img :src="require(`@/assets/images/icons/rules/${rule.icon}.png`)" class="rule-icon" alt=""/>
      <div class="rule-title">
        <div class="rule-name">{{ rule.name }}</div>
        <div class="rule-category" title="Category">{{ rule.category }}</div>
      </div>
      <div class="rule-actions">
        <div class="rule-close d-none d-md-block" @click="$emit('clear-rule')">
          <img src="@/assets/images/icons/misc/close.png" alt="Close"/>
        </div>
      </div>
    </div>
    <hr/>
    <div class="rule-description" v-html="prettyDescription" @click="handleDescriptionClick">
    </div>
    <div class="rule-foot">
      <span title="Which book/source this rule originates from"><img src="@/assets/images/icons/spell_features/source.png" alt="Source"/> {{ rule.location || rule.sourceName }}</span><br/>
      <span class="rule-tags" v-if="rule.tags" title="Additional tags associated to this rule"><img src="@/assets/images/icons/misc/tag.png" alt="Tags"/> {{ rule.tags.join(", ") }}</span>
    </div>
  </div>
</template>

<script>
import Icons from '@/util/icons.js';
import TextBeautifier from '@/util/textBeautifier.js';

export default {
  name: 'RuleView',
  props: {
    app: Object,
    rule: Object
  },
  computed: {
    icons() {
      return Icons;
    },
    prettyDescription() {
      return TextBeautifier.beautify(this.rule.description);
    }
  },
  methods: {
    handleDescriptionClick(evt) {
      if (evt.target.className == 'dynamic-link') { // TODO: extract this bit of logic present in 3 components to a mixin/directive
        this.$router.push('/rules/' + evt.target.innerText.replace(/ /g, "-"));
      }
    }
  }
}
</script>

<style>
.rule-details {
  padding-top: 10px;
  text-align: left;
  font-size: 16px;
}
.rule-details h2 {
  font-size: 120%;
  font-weight: bold;
  border-bottom: 1px solid #333;
  padding-bottom: 5px;
}
.rule-head {
  display: flex;
  justify-content: space-between;
}
.rule-title {
  padding-left: 10px;
  width: 100%;
}
.rule-icon {
  flex-grow: 0;
  height: 64px;
}
.rule-actions img {
  width: 24px;
  transition: filter 0.3s, opacity 0.3s;
  opacity: 0.3;
  filter: saturate(0%);
  cursor: pointer;
}
.rule-name {
  font-size: 22px;
  font-weight: bold;
}
.rule-category {
  font-size: 16px;
  font-style: italic;
}
.rule-foot img {
  height: 26px;
}
.rule-tags {
  font-style: italic;
}
@media (pointer: fine) {
  .rule-close:hover img {
    filter: saturate(100%);
    opacity: 1;
  }
}
</style>
