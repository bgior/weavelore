<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row no-gutters">
    <div class="col-12 col-lg-5 col-xl-6 query-area pr-2">
      <input type="text" class="form-control query" v-focus v-model="rawQueryText" ref="queryField" placeholder="Search..." @keydown="handleQueryKeydown"/>
      <div class="search-actions">
        <span @click="clearQuery">
          <img src="@/assets/images/icons/misc/close.png" class="details-icon" title="Reset query and filters" alt=""/>
        </span>
        <span class="d-none d-md-inline-block" @click="$emit('toggle-detailed-view')">
          <img src="@/assets/images/icons/misc/details.png" :class="`details-icon ${detailedModeOn ? 'active' : ''}`" title="Toggle detailed spell list" alt=""/>
        </span>
        <span @click="query.favorites = !query.favorites">
          <img src="@/assets/images/icons/misc/favorite.png" :class="`details-icon ${query.favorites ? 'active' : ''}`" title="Toggle favorites filter" alt=""/>
        </span>
        <SpellEditionControls :app="app" :selectedSpell="selectedSpell" @select-spell="s => $emit('select-spell', s)"/>
      </div>
    </div>
    <div class="col-12 col-lg-7 col-xl-6 filters">
      <div class="row no-gutters">
        <div class="d-block col-4 col-lg-3 filter">
          <CustomSelect v-model="query.class" :options="classOptions"/>
        </div>
        <div class="d-block col-4 col-lg-3 filter">
          <CustomSelect v-model="query.level" :options="levelOptions"/>
        </div>
        <div class="d-block col-4 col-lg-3 filter">
          <CustomSelect v-model="query.school" :options="schoolOptions"/>
        </div>
        <div class="d-none d-lg-block col-3 filter">
          <CustomSelect v-model="query.sourceName" :options="sourceOptions" align="right"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomSelect from "@/components/general/CustomSelect.vue";
import SpellEditionControls from "@/components/spells/SpellEditionControls.vue";
import spellOptions from '@/util/spellOptions.js';
import { debounce } from "debounce";

export default {
  name: 'SpellsToolbar',
  components: {
    SpellEditionControls,
    CustomSelect
  },
  props: {
    app: Object,
    query: Object,
    selectedSpell: Object,
    detailedModeOn: Boolean
  },
  data() { return {
    rawQueryText: '',
  }},
  computed: {
    classOptions() {
      return [{ value: '', text: 'Any class', image: require('@/assets/images/icons/misc/none.png') }].concat(spellOptions.classOptions);
    },
    levelOptions() {
      return [{ value: '', text: 'Any level' }].concat(spellOptions.levelOptions);
    },
    schoolOptions() {
      return [{value: '', text: 'Any school', image: require('@/assets/images/icons/misc/none.png')}].concat(spellOptions.schoolOptions);
    },
    sourceOptions() {
      return [{value: '', text: 'Any source', image: require('@/assets/images/icons/misc/none.png')}].concat(spellOptions.sourceOptions(this.app));
    }
  },
  methods: {
    // Resets the search text field and filters to the default state
    clearQuery() {
      this.rawQueryText = '';
      this.query.text = '';
      this.query.level = '';
      this.query.class = '';
      this.query.school = '';
      this.query.sourceName = '';
      this.$refs.queryField.focus();
    },
    // Add the ability to move through the spell list by using the Up/Down arrows while focused on the query input
    handleQueryKeydown(evt) {
      if (evt.keyCode == 38) { // Up arrow
        this.$emit('navigate-spells', 'up');
        evt.preventDefault();
      } else if (evt.keyCode == 40) { // Down arrow
        this.$emit('navigate-spells', 'down');
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
        // If the query starts with a period, it means the user wants to search in the spell description too
        this.query.includeDescription = this.rawQueryText.startsWith(".");
        // Remove the period from the query if present
        this.query.text = (this.query.includeDescription ? this.rawQueryText.substring(1) : this.rawQueryText).toLowerCase();
      }, 200)();
    }
  }
}
</script>

<style>
  .filter {
    padding: 0px 5px !important;
  }
  .query-area img {
    height: 30px;
    cursor: pointer;
    transition: filter 0.3s, opacity 0.3s;
    opacity: 0.3;
    filter: saturate(0%);
  }
  .query-area img.active {
    filter: saturate(100%);
    opacity: 1;
  }
  .query-area {
    display: flex;
    align-items: flex-end;
  }
  .query-area > span {
    flex-shrink: 0;
  }
  .search-actions {
    padding: 5px;
    flex-shrink: 0;
  }
  input.query {
    display: inline-block;
    flex-grow: 1;
    width: 10px !important; /* Will be "stretched" by flex to the appropriate width */
  }
  /* Make favorite hover effect work only on non-touch devices, because otherwise it looks favorited after un-favoriting */
  @media (pointer: fine) {
    .query-area img:hover {
      filter: saturate(100%);
      opacity: 1;
    }
    .query-area img.disabled, .query-area img.disabled:hover {
      filter: saturate(0%);
      opacity: 0.15;
      cursor: not-allowed;
    }
  }
</style>
