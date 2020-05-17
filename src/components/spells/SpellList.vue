<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div>
    <div class="row spells scrollable-panel" v-if="spells.length > 0">
      <template v-if="!detailedModeOn">
        <div v-for="s in spells" :key="s.codename" :class="`spell col-12 ${panelIsOpen ? (s.codename == selectedSpell.codename ? 'selected' : '') : 'col-md-6 col-lg-4 col-xl-3'}`" @click="spellClicked($event, s.codename)">
          <span class="level">{{ s.level }}</span>
          <img :src="icons.schoolIcon(s)" class="school" alt=""/> {{ s.name }}
        </div>
      </template>
      <template v-else>
        <div v-for="s in spells" :key="s.codename" class="spell col-12" @click="spellClicked($event, s.codename)">
          <img v-for="c in classes" :key="c" :src="icons.classIcon(c)" :class="s.classes.includes(c) ? '' : 'absent'" alt=""/>
          <img src="@/assets/images/icons/components/verbal.png" :class="s.verbal ? '' : 'absent'" alt=""/>
          <img src="@/assets/images/icons/components/somatic.png" :class="s.somatic ? '' : 'absent'" alt=""/>
          <img src="@/assets/images/icons/components/material.png" :class="s.material > 0 ? '' : 'absent'" alt=""/>
          <img src="@/assets/images/icons/components/expensive2.png" :class="s.material == 2 ? '' : 'absent'" alt=""/>
          <img src="@/assets/images/icons/components/expensive3.png" :class="s.material == 3 ? '' : 'absent'" alt=""/>
          <img :src="icons.aoeIcon(s)" :class="s.aoe ? '' : 'absent'" alt=""/>
          <img :src="icons.rangeIcon(s)" alt=""/>
          <img :src="icons.durationIcon(s)" alt=""/>
          <img src="@/assets/images/icons/spell_features/concentration.png" :class="s.concentration ? '' : 'absent'" alt=""/>
          <img :src="icons.castingIcon(s)" alt=""/>
          <img src="@/assets/images/icons/spell_features/ritual.png" :class="s.ritual ? '' : 'absent'" alt=""/>
          <img src="@/assets/images/icons/spell_features/scalable.png" :class="s.atHigherLevel ? '' : 'absent'" alt=""/>
          <img src="@/assets/images/icons/misc/favorite.png" :class="app.settings.favorites.has(s.codename) ? '' : 'absent'" alt=""/>
          <span class="level">{{ s.level }}</span>
          <img :src="icons.schoolIcon(s)" class="school" alt=""/>
          {{ s.name }}
        </div>
      </template>
    </div>
    <div v-else class="list-message">
      No spells found
    </div>
  </div>
</template>

<script>
import Icons from '@/util/icons.js';
import constants from '@/util/constants.js';

export default {
  name: 'SpellList',
  props: {
    app: Object,
    spells: Array,
    panelIsOpen: Boolean,
    selectedSpell: Object,
    detailedModeOn: Boolean
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
    spellClicked(event, key) {
      if (!this.selectedSpell) {
        const div = event.currentTarget;
        setTimeout(() => div.scrollIntoView({behavior: "smooth", block: "center"}), 100);
      }
      this.$emit("spell-clicked", key);
    }
  }
}
</script>

<style>
  .spells {
    padding: 3px;
    font-size: 16px;
    line-height: 1;
    color: #eee;
  }
  .spell {
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
  .spell:hover, .spell.selected {
    background-color: #272727;
    border-color: #212121;
  }
  .spell:hover .school, .spell.selected .school {
    transform: scale(1.05);
    filter: brightness(1.4);
  }
  .spell img {
    height: 26px;
  }
  .level {
    font-size: 20px;
    width: 20px;
    display: inline-block;
    text-align: center;
    font-weight: bold;
    color: #5a5a5a;
  }
  .spell img.absent {
    opacity: 0.1;
  }
  @media(max-width: 767px) {
    .spells { font-size: 18px; }
  }
</style>
