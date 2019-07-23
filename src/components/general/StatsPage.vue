<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row text-left justify-content-center">
    <div class="col-12 col-md-10 col-xl-8">
      <h1 class="my-4">Stats<img :src="require('@/assets/images/icons/menu/stats.png')"/></h1>
      <p>Total spells: <b>{{ app.spells.length }}</b> ({{ app.settings.favorites.size }} favorites)</p>
      <p>Sources:
        <ul>
          <li v-for="source of app.contentDatabase.data.sources">
            <b>{{ source.name }}</b> <span class="source-version">(v{{ source.version }})</span>: {{ source.spells.length }} spells
          </li>
        </ul>
      </p>
      <div class="row">
        <div class="col-12 col-sm-4">
          <p><b>By school</b></p>
          <p v-for="school in app.schools">
            <img class="stats-icon" :src="icons.schoolIcon({school})"/> {{ stats.schools[school] }} {{ school }}
          </p>
        </div>
        <div class="col-12 col-sm-4">
          <p><b>By level</b></p>
          <p v-for="level in [0,1,2,3,4,5,6,7,8,9]">
            <span class="level">{{ level }}</span>  {{ stats.levels[level] }} spells
          </p>
        </div>
        <div class="col-12 col-sm-4">
          <p><b>By class</b></p>
          <p v-for="className in app.classes">
            <img class="stats-icon" :src="icons.classIcon(className)"/>  {{ stats.classes[className] }} {{ className }} spells
          </p>
        </div>
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
import Icons from '@/util/icons.js'

export default {
  name: 'StatsPage',
  props: {
    app: Object
  },
  computed: {
    stats: function() {
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
    icons: function() {
      return Icons;
    }
  }
}
</script>
