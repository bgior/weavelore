<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="spell-editor scrollable-panel">
    <div class="row my-4">
      <div class="col-12 col-md-6 col-lg-3">
        <input type="text" v-model="spell.name" class="form-control font-weight-bold"/>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <CustomSelect v-model="spell.school" :options="schoolOptions"/>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <CustomSelect v-model.number="spell.level" :options="levelOptions"/>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <CustomSelect v-model="spell.sourceName" :options="sourceOptions"/>
      </div>
    </div>
    <div class="row my-4">
      <div class="col-12 col-lg-6 col-xl-3">
        <div class="field-with-icon pr-3">
          <img :src="icons.rangeIcon(spell)" alt=""/>  <input type="text" v-model="spell.range" class="form-control" placeholder="Range"/>
        </div>
        <div class="field-with-icon pr-3">
          <img :src="icons.durationIcon(spell)" alt=""/>  <input type="text" v-model="spell.duration" class="form-control" placeholder="Duration"/>
        </div>
        <div class="field-with-icon pr-3 mb-2">
          <img :src="icons.castingIcon(spell)" alt=""/>  <input type="text" v-model="spell.casting" class="form-control" placeholder="Casting time"/>
        </div>
      </div>
      <div class="col-12 col-lg-6 col-xl-3">
        <Toggler :checked="spell.concentration" :text="'Concentration'" :icon="require('@/assets/images/icons/spell_features/concentration.png')" @toggle="spell.concentration = !spell.concentration"/>
        <Toggler :checked="spell.ritual" :text="'Ritual'" :icon="require('@/assets/images/icons/spell_features/ritual.png')" @toggle="spell.ritual = !spell.ritual"/>
        <Toggler :checked="spell.atHigherLevel != null" :text="'Scalable'" :icon="require('@/assets/images/icons/spell_features/scalable.png')" @toggle="spell.atHigherLevel = spell.atHigherLevel == null ? '' : null"/>
      </div>

      <div class="col-12 col-lg-6 col-xl-3">
        <CustomSelect v-model.number="spell.material" :options="materialOptions" class="se-materials mb-3"/>
        <Toggler :checked="spell.verbal" :text="'Verbal'" :icon="require('@/assets/images/icons/components/verbal.png')" @toggle="spell.verbal = !spell.verbal"/>
        <Toggler :checked="spell.somatic" :text="'Somatic'" :icon="require('@/assets/images/icons/components/somatic.png')" @toggle="spell.somatic = !spell.somatic"/>
      </div>
      <div class="col-12 col-lg-6 col-xl-3 pl-4">
        <div class="row">
          <Toggler v-for="klass in classes" :key="klass" :checked="spell.classes.includes(klass)" :text="klass" :icon="icons.classIcon(klass)" @toggle="toggleClass(klass)" class="col-6 class-toggler"/>
        </div>
      </div>
    </div>
    <div class="mt-4">Description:</div>
    <textarea v-model="spell.description" class="form-control" rows="4" placeholder="Description"></textarea>
    <template v-if="spell.atHigherLevel != null">
      <div class="mt-4"><img src="@/assets/images/icons/spell_features/scalable.png" class="se-icon" alt=""/> At higher levels:</div>
      <textarea v-model="spell.atHigherLevel" class="form-control" rows="2" placeholder="At higher levels"></textarea>
    </template>
    <div v-show="spell.material > 0">
      <div class="mt-4"><img src="@/assets/images/icons/components/material.png" class="se-icon" alt=""/> Materials:</div>
      <input type="text" v-model="spell.materials" class="form-control" placeholder="Materials"/>
    </div>

    <div class="row mt-4">

      <div class="col-6 col-md-3">
        Area of effect:
        <CustomSelect v-model="chosenAoeType" :options="aoeOptions"/>
      </div>
      <!-- <div class="col-6 col-md-3">
        Range: <b>{{ spell.range }}</b> feet
        <input type="range" v-model.number="spell.range" step="5" min="0" max="300"/>
      </div> -->
      <div class="col-6 col-md-3" v-if="spell.aoe">
        Size: <b>{{ chosenAoeSize }}</b> feet
        <input type="range" v-model.number="chosenAoeSize" step="5" min="5" max="120"/>
      </div>
    </div>

    <Diagram :defaultRange="numericRange" :aoe="spell.aoe" title="Range visualization"/>
  </div>
</template>
<script>
import spellOptions from '@/util/spellOptions.js';
import CustomSelect from "@/components/general/CustomSelect.vue";
import constants from '@/util/constants.js';
import Icons from '@/util/icons.js';
import Diagram from './Diagram.vue';
import Toggler from '@/components/general/Toggler.vue';
const aoeSizeMap = { sphere: "radius", cube: "edge", cone: "length" }; // Defines the name of the size attribute corresponding to each AoE type

export default {
  name: 'SpellEditor',
  components: {
    CustomSelect,
    Diagram,
    Toggler
  },
  props: {
    app: Object,
    spell: Object
  },
  data: () => { return {
    chosenAoeType: '',
    chosenAoeSize: 10
  }},
  computed: {
    classOptions: () => spellOptions.classOptions,
    levelOptions: () => spellOptions.levelOptions,
    schoolOptions: () => spellOptions.schoolOptions,
    materialOptions: () => spellOptions.materialOptions,
    sourceOptions() {
      return spellOptions.sourceOptions(this.app);
    },
    aoeOptions: () => spellOptions.aoeOptions,
    icons() {
      return Icons;
    },
    classes() {
      return constants.classes;
    },
    // Returns an integer corresponding to the spell's range in feet, or 0 if it's Self/Touch/unrecognized
    numericRange() {
      if (this.aoe && this.aoe.range) {
        // If the AOE has a manually overriden range, use that instead
        return this.aoe.range;
      } else {
        // Parse the number of feet from the string
        const match = this.spell.range.match(/(\d+) feet/);
        return match ? parseInt(match[1]) : 0;
      }
    }
  },
  methods: {
    // Given the name of a class, add/remove it from the spell being edited
    toggleClass(klass) {
      if (this.spell.classes.includes(klass)) {
        this.spell.classes = this.spell.classes.filter(c => c != klass);
      } else {
        this.spell.classes.push(klass);
      }
    },
    // Adds or removes the presence of an AoE for this spell
    toggleSpellAoE() {
      if (this.spell.aoe) {
        delete this.spell.aoe;
      } else {
        this.$set(this.spell, "aoe", { type: "sphere", size: 10 });
      }
    },
    // Loads the auxiliary AoE-related fields
    loadAoeFields() {
      if (this.spell.aoe) {
        this.chosenAoeType = this.spell.aoe.type;
        this.chosenAoeSize = this.spell.aoe[aoeSizeMap[this.chosenAoeType]];
      } else {
        this.chosenAoeType = '';
        this.chosenAoeSize = 10;
      }
    }
  },
  watch: {
    // The reason we bind the AoE type CustomSelect to 'chosenAoeType' instead of 'spell.aoe.type'
    // is that not all spells have the 'aoe' attribute to begin with. So this method handles the
    // creation/removal of that attribute based on the user's choice.
    chosenAoeType() {
      if (this.chosenAoeType == '') { // If the user chose 'None'
        delete this.spell.aoe;
      } else {
        const aoe = { type: this.chosenAoeType }
        aoe[aoeSizeMap[this.chosenAoeType]] = this.chosenAoeSize;
        this.$set(this.spell, 'aoe', aoe);
      }
    },
    // The following 2 methods keep 'chosenAoeSize' and the corresponding 'aoe.xxx' attribute in sync
    chosenAoeSize() {
      if (this.spell.aoe) {
        this.spell.aoe[aoeSizeMap[this.chosenAoeType]] = this.chosenAoeSize;
      }
    },
    spell() {
      this.loadAoeFields();
    },
    // If the name changes, we need to change the 2 autocalculated fields as well
    "spell.name": function() {
      this.spell.downcasedName = this.spell.name.toLowerCase();
      this.spell.codename = this.spell.downcasedName.replace(/[/ ]/g, '-');
    },
    // Changing the sourceName attribute alone isn't enough, we need to move the spell to the target source's spell list
    "spell.sourceName": function() {
      this.app.contentDatabase.relocateSpell(this.spell);
    }
  },
  created() {
    this.loadAoeFields();
  }
}
</script>
<style>
  .class-toggler {
    height: 30px;
    overflow: hidden;
    word-break: break-all;
  }
  .field-with-icon {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .field-with-icon img {
    flex-grow: 0;
    height: 26px;
  }
  .field-with-icon input {
    width: 0;
    flex-grow: 1;
  }
  .se-materials > .cs-field, .se-materials > .cs-options {
    text-transform: none;
  }
  .se-icon {
    height: 26px;
  }
</style>
