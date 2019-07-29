<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row no-gutters">
    <div class="col-12 col-lg-6 query-area pr-2">
      <input type="text" class="form-control query" v-focus v-model="rawQueryText" ref="queryField" placeholder="Search..."/>
      <div class="search-actions">
        <span @click="clearQuery">
          <img :src="require('@/assets/images/icons/misc/close.png')" class="details-icon" title="Reset query and filters"/>
        </span>
        <span class="d-none d-md-inline-block" @click="$emit('toggleDetailedView')">
          <img :src="require('@/assets/images/icons/misc/details.png')" :class="`details-icon ${detailedModeOn ? 'active' : ''}`" title="Toggle detailed spell list"/>
        </span>
        <span @click="query.favorites = !query.favorites">
          <img :src="require('@/assets/images/icons/misc/favorite.png')" :class="`details-icon ${query.favorites ? 'active' : ''}`" title="Toggle favorites filter"/>
        </span>
      </div>
    </div>
    <div class="col-12 col-lg-6 filters">
      <div class="row no-gutters">
        <div class="col-4 filter">
          <CustomSelect v-model="query.class" :options="classOptions"/>
        </div>
        <div class="col-4 filter">
          <CustomSelect v-model="query.level" :options="levelOptions"/>
        </div>
        <div class="col-4 filter">
          <CustomSelect v-model="query.school" :options="schoolOptions" align="right"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomSelect from "@/components/general/CustomSelect.vue";
import Icons from '@/util/icons.js';
import constants from '@/util/constants.js';
import { debounce } from "debounce";

export default {
  name: 'SpellSearcher',
  props: {
    app: Object,
    query: Object,
    detailedModeOn: Boolean
  },
  data() { return {
    rawQueryText: '',
  }},
  computed: {
    classOptions() {
      return [{ value: '', text: 'Any class', image: require('@/assets/images/icons/misc/none.png') }].
      concat(constants.classes.map(c => { return { value: c, text: c, image: Icons.classIcon(c) }}));
    },
    levelOptions() {
      return [
        { value: '', text: 'Any level' }, { value: '0', text: 'Cantrip' }, { value: '1', text: '1st level' },
        { value: '2', text: '2nd level' }, { value: '3', text: '3rd level' }
      ].concat([4,5,6,7,8,9].map(n => { return { value: n.toString(), text: n + 'th level' }}));
    },
    schoolOptions() {
      return [{value: '', text: 'Any school', image: require('@/assets/images/icons/misc/none.png')}].
      concat(constants.schools.map(s => { return { value: s, text: s, image: Icons.schoolIcon({school: s}) }}));
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
      this.$refs.queryField.focus();
    },
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
  },
  components: {
    CustomSelect
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
  }
  /* Make favorite hover effect work only on non-touch devices, because otherwise it looks favorited after un-favoriting */
  @media (pointer: fine) {
    .query-area img:hover {
      filter: saturate(100%);
      opacity: 1;
    }
  }
</style>
