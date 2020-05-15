<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row no-gutters">
    <div class="col-12 query-area">
      <input type="text" class="form-control query" v-focus v-model="rawQueryText" ref="queryField" placeholder="Search..." @keydown="handleQueryKeydown"/>
    </div>
  </div>
</template>

<script>
import { debounce } from "debounce";

export default {
  name: 'RuleSearcher',
  props: {
    app: Object,
    query: Object
  },
  data() { return {
    rawQueryText: ''
  }},
  methods: {
    // Add the ability to move through the rule list by using the Up/Down arrows while focused on the query input
    handleQueryKeydown(evt) {
      if (evt.keyCode == 38) { // Up arrow
        this.$emit('navigate-rules', 'up');
        evt.preventDefault();
      } else if (evt.keyCode == 40) { // Down arrow
        this.$emit('navigate-rules', 'down');
        evt.preventDefault();
      }
    }
  },
  watch: {
    rawQueryText() {
      // Binding the text field directly to query.text can make the app stutter a bit because it has to re-render
      // the list with each keydown event. Instead, we use a separate field called rawQueryText that updates
      // query.text at a limited rate (aka debouncing).
      debounce(() => {
        // If the query starts with a period, it means the user wants to search in the rule description too
        this.query.includeDescription = this.rawQueryText.startsWith(".");
        // Remove the period from the query if present
        this.query.text = (this.query.includeDescription ? this.rawQueryText.substring(1) : this.rawQueryText).toLowerCase();
      }, 200)();
    }
  }
}
</script>

<style>

</style>
