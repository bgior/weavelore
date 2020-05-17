<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row text-left justify-content-center">
    <div class="col-12 col-md-10 col-xl-8">
      <h1 class="my-4">Stats<img src="@/assets/images/icons/menu/stats.png" alt=""/></h1>
      <p>Total spells: <b>{{ app.spells.length }}</b> ({{ app.settings.favorites.size }} favorites)</p>
      <div class="row">
        <section class="col-12 col-sm-4">
          <h2 class="mb-3">By school</h2>
          <p v-for="school in constants.schools" :key="school">
            <img class="stats-icon" :src="icons.schoolIcon({school})" alt=""/> {{ stats.schools[school] }} {{ school }}
          </p>
        </section>
        <section class="col-12 col-sm-4">
          <h2 class="mb-3">By level</h2>
          <p v-for="level in constants.levels" :key="level">
            <span class="level">{{ level }}</span>  {{ stats.levels[level] }} spells
          </p>
        </section>
        <section class="col-12 col-sm-4">
          <h2 class="mb-3">By class</h2>
          <p v-for="className in constants.classes" :key="className">
            <img class="stats-icon" :src="icons.classIcon(className)" alt=""/>  {{ stats.classes[className] }} {{ className }} spells
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
<style>
  .stats-icon {
    height: 26px;
  }
  .source-version {
    color: #aaa;
    font-size: 70%;
  }
</style>
<script>
import Icons from '@/util/icons.js';
import constants from '@/util/constants.js';

export default {
  name: 'StatsPage',
  props: {
    app: Object
  },
  computed: {
    stats() {
      var schools = { abjuration: 0, conjuration: 0, divination: 0, enchantment: 0, evocation: 0, illusion: 0, necromancy: 0, transmutation: 0 };
      var levels = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
      var classes = { bard: 0, cleric: 0, druid: 0, paladin: 0, ranger: 0, sorcerer: 0, warlock: 0, wizard: 0 };
      for (var s of this.app.spells) {
        schools[s.school]++;
        levels[s.level]++;
        s.classes.forEach(c => classes[c]++);
      }
      return { schools, levels, classes };
    },
    icons() {
      return Icons;
    },
    constants() {
      return constants;
    }
  },
  metaInfo: {
    title: "Statistics - WeaveLore",
    meta: [
      { vmid: "description", name: "description", content: "View statistics about all the spells currently loaded in the application, such as spells by school, class and level." },
      { vmid: "robots", name: "robots", content: "noindex" }
    ]
  }
}
</script>
