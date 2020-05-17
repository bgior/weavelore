<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row text-left justify-content-center">
    <div class="col-12 col-md-10 col-xl-8">
      <h1 class="my-4">Area calculator<img src="@/assets/images/icons/menu/areas.png" alt=""/></h1>
      <div class="row">
        <div class="col-6 col-md-3">
          Type: <span v-b-modal.areasHelp id="areasHelp">( ? )</span>
          <CustomSelect v-model="type" :options="aoeOptions"/>
        </div>
        <div class="col-6 col-md-3">
          Range: <b>{{ range }}</b> feet
          <input type="range" v-model.number="range" step="5" min="0" max="300"/>
        </div>
        <div class="col-6 col-md-3" v-show="type != ''">
          Size: <b>{{ size }}</b> feet
          <input type="range" v-model.number="size" step="5" min="5" max="120"/>
        </div>
        <div class="col-6 col-md-3" v-show="type == 'cone'">
          Direction: {{ angleDegrees }}º
          <input type="range" v-model.number="angleDegrees" min="0" max="360"/>
        </div>
        <div class="col-6 col-md-3" v-show="type == 'sphere'">
          Center:
          <CustomSelect v-model="center" :options="centerOptions"/>
        </div>
      </div>
    </div>
    <div class="col-12" style="text-align: center">
      <Diagram :defaultRange="range" :aoe="type == '' ? null : { type: type, radius: size, edge: size, length: size, angle: angleRadians, center: center }"/>
    </div>
    <b-modal id="areasHelp" title="Notes">
      <ul>
        <li>The following criteria are used, for lack of a standard, to determine which cells are affected by an AOE (Area of Effect):</li>
        <ul>
          <li><b>Circle:</b> The cell's center point is within the circle.</li>
          <li><b>Cone:</b> The triangle intersects the circle inscribed in the cell.</li>
        </ul>
        <li>AOEs are always centered in a grid intersection point, except in the case of cubes whose size is not multiple of 10, and spheres with range 0.</li>
      </ul>
      <div slot="modal-footer" class="w-100">
        <b-button variant="primary" size="sm" class="float-right" @click="$bvModal.hide('areasHelp')">Close</b-button>
      </div>
    </b-modal>
  </div>
</template>
<style>
  #areasHelp {
    float: right;
    color: #444;
    cursor: pointer;
  }
</style>
<script>
import spellOptions from '@/util/spellOptions.js';
import CustomSelect from '@/components/general/CustomSelect.vue';
import Diagram from '../spells/Diagram.vue';

export default {
  name: 'AreasPage',
  components: {
    Diagram,
    CustomSelect
  },
  props: {
    app: Object
  },
  data() { return {
    type: "cone",
    size: 30,
    range: 0,
    center: '',
    angleRadians: 0,
    angleDegrees: 0
  }},
  computed: {
    aoeOptions: () => spellOptions.aoeOptions,
    centerOptions: () => spellOptions.centerOptions
  },
  watch: {
    angleDegrees() {
      this.angleRadians = this.angleDegrees * Math.PI / 180;
    },
    type() {
      if (this.type == '' && this.range < 10) {
        this.range = 20;
      }
      if (this.type == 'cone') {
        this.range = 0;
      }
    }
  },
  metaInfo: {
    title: "AoE Calculator - WeaveLore",
    meta: [
      { vmid: "description", name: "description", content: "Visualize the AoE (Area of Effect) of different D&D 5e spells on a grid using this handy simulator. Supports spheres, cones and cubes of arbitrary size." }
    ]
  }
}
</script>
