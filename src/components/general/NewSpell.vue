<template>
  <div class="row text-left justify-content-center">
    <div class="col-12 col-md-10 col-xl-8">
      <template>
        <hr/>
        <div id="spellcontent">
          <input class="form-control query" v-model="spell.name" type="text" id="name" placeholder="name">
          <br /><br />
          Classes<br />
          <table id="classes">
            <tr>
              <td>
                <input :style="'display:none'" @click="classClick" type="checkbox" id="bard" value="bard" :checked="spell.classes.indexOf('bard') > -1" />
                <label for="bard"><img :class="`cs-field-icon ${spell.classes.indexOf('bard') > -1 ? '' : 'absent'}`" :src="classOptions.bard.image" />Bard</label>
              </td>
              <td>
                <input :style="'display:none'" @click="classClick" type="checkbox" id="cleric" value="cleric" :checked="spell.classes.indexOf('cleric') > -1" />
                <label for="cleric"><img :class="`cs-field-icon ${spell.classes.indexOf('cleric') > -1 ? '' : 'absent'}`" :src="classOptions.cleric.image" />Cleric</label>
              </td>
              <td>
                <input :style="'display:none'" @click="classClick" type="checkbox" id="druid" value="druid" :checked="spell.classes.indexOf('druid') > -1" />
                <label for="druid"><img :class="`cs-field-icon ${spell.classes.indexOf('druid') > -1 ? '' : 'absent'}`" :src="classOptions.druid.image" />Druid</label>
              </td>
            </tr>
            <tr>
              <td>
                <input :style="'display:none'" @click="classClick" type="checkbox" id="paladin" value="paladin" :checked="spell.classes.indexOf('paladin') > -1" />
                <label for="paladin"><img :class="`cs-field-icon ${spell.classes.indexOf('paladin') > -1 ? '' : 'absent'}`" :src="classOptions.paladin.image" />Paladin</label>
              </td>
              <td>
                <input :style="'display:none'" @click="classClick" type="checkbox" id="sorcerer" value="sorcerer" :checked="spell.classes.indexOf('sorcerer') > -1" />
                <label for="sorcerer"> <img :class="`cs-field-icon ${spell.classes.indexOf('sorcerer') > -1 ? '' : 'absent'}`" :src="classOptions.sorcerer.image" />Sorcerer</label>
              </td>
              <td>
                <input :style="'display:none'" @click="classClick" type="checkbox" id="warlock" value="warlock" :checked="spell.classes.indexOf('warlock') > -1" />
                <label for="warlock"><img :class="`cs-field-icon ${spell.classes.indexOf('warlock') > -1 ? '' : 'absent'}`" :src="classOptions.warlock.image" />Warlock</label>
              </td>
            </tr>
            <tr>
              <td>
                <input :style="'display:none'" @click="classClick" type="checkbox" id="wizard" value="wizard" :checked="spell.classes.indexOf('wizard') > -1" />
                <label for="wizard"><img :class="`cs-field-icon ${spell.classes.indexOf('wizard') > -1 ? '' : 'absent'}`" :src="classOptions.wizard.image" />Wizard</label>
              </td>
              <td>
              </td>
              <td>
              </td>
            </tr>castingIcon
          </table>
          <br />
          School<br />
          <CustomSelect v-model="spell.school" :options="schoolOptions"/>
          <br />
          Level<br />
          <CustomSelect v-model="spell.level" :options="levelOptions"/>
          <br /><br />
          <label for="range"><img class="cs-field-icon" :src="Icons.castingIcon(spell)" /></label><input class="form-control query" v-model="spell.casting" type="text" id="casting" placeholder="Casting time">
          <br /><br />
          <label for="range"><img class="cs-field-icon" :src="Icons.durationIcon(spell)" /></label><input class="form-control query" v-model="spell.duration" type="text" id="duration" placeholder="Duration">
          <br /><br />
          <label for="range"><img class="cs-field-icon" :src="Icons.rangeIcon(spell)" /></label><input class="form-control query" v-model="spell.range" type="text" id="range" placeholder="Range">
          <br /><br />
          Components<br />
          <table>
            <tr>
              <td>
                <input :style="'display:none'" type="checkbox" id="somatic" v-model="spell.somatic">
                <label for="somatic"><img :class="`cs-field-icon ${spell.somatic ? '' : 'absent'}`" :src="require('@/assets/images/icons/components/somatic.png')" />Somatic</label>
              </td>
              <td>
                <input :style="'display:none'" type="checkbox" id="verbal" v-model="spell.verbal">
                <label for="verbal"><img :class="`cs-field-icon ${spell.verbal ? '' : 'absent'}`" :src="require('@/assets/images/icons/components/verbal.png')" />Verbal</label>
              </td>
            </tr>
          </table>
          <table>
            <tr>
              <td colspan="2">
                <label for="material">Material</label><br />
                <CustomSelect v-model="spell.material" :options="materialOptions"/>
              </td>
            </tr>
            <tr>
              <td colspan="">
                Material description<br />
                <textarea class="form-control" v-model="spell.materials" id="materials" cols="120"></textarea>
              </td>
            </tr>
          </table>
          
          <br />
          <input :style="'display:none'" type="checkbox" id="concentration" v-model="spell.concentration">
          <label for="concentration"><img :class="`cs-field-icon ${spell.concentration ? '' : 'absent'}`" :src="require('@/assets/images/icons/spell_features/concentration.png')" />Concentration</label>
          <br /><br />
          <input :style="'display:none'" type="checkbox" id="ritual" v-model="spell.ritual">
          <label for="ritual"><img :class="`cs-field-icon ${spell.ritual ? '' : 'absent'}`" :src="require('@/assets/images/icons/spell_features/ritual.png')" />Ritual</label>
          <br /><br />
          Description<br />
          <textarea class="form-control" v-model="spell.description" id="description" cols="120" rows="12"></textarea>
          <br /><br />
          <input class="form-control query" type="text" id="atHigherLevel" placeholder="At higher levels..." v-model="spell.atHigherLevel" />
          <br /><br />
          <label for="aoe">AOE effect</label><br />
          <CustomSelect @input="aSelect" :options="aoeOptions" :value="spell.aoe ? spell.aoe.type : 'none'" />
          <br />
          <input class="form-control query" @keyup="aos" type="text" id="aoesize" data-varname="" placeholder="AOE size" :style="'display:' + (spell.aoe ? 'block':'none')" :value="(spell.aoe && spell.aoe !== 'None') ? spell.aoe[aoeSizeType[spell.aoe.type.toLowerCase()]] : '0'" />
          <br />
          <br />

          Add to source
          <br />
          <select v-model="sourceIndex">
            <option v-for="(item, key, index) in sources" :value="key">{{item.name}}</option>
          </select>

          <br /><br />

          <button @click="savespell" class="btn btn-primary">Save</button>
          <br />
          <br />
        </div>
      </template>
    </div>
  </div>
</template>
<script>

import { debounce } from "debounce";
import ContentDatabase from '@/util/contentDatabase.js'
import constants from '@/util/constants.js';
import CustomSelect from "@/components/general/CustomSelect.vue";
import Icons from '@/util/icons.js';

const aoe = [
  {value: "none", text: "None", image: require('@/assets/images/icons/misc/none.png') },
  {value: "cone", text: "Cone", image: Icons.aoeIcon({aoe:{type:"cone"}})},
  {value: "cube", text: "Cube", image: Icons.aoeIcon({aoe:{type:"cube"}})},
  {value: "sphere", text: "Sphere", image: Icons.aoeIcon({aoe:{type:"sphere"}})}
];

const aoeSizeType = {
  "none": "none",
  "sphere": "radius",
  "cube": "edge",
  "cone": "length"
};
const classes = [
  //"Artificer",
  //"Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  //"Fighter",
  //"Monk",
  "Paladin",
  //"Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard"
];
const levels = [
  {id: 0, desc: "Cantrip"},
  {id: 1, desc: "1"},
  {id: 2, desc: "2"},
  {id: 3, desc: "3"},
  {id: 4, desc: "4"},
  {id: 5, desc: "5"},
  {id: 6, desc: "6"},
  {id: 7, desc: "7"},
  {id: 8, desc: "8"},
  {id: 9, desc: "9"}
];
const material = [
  {value: "0", text:"No requirement", image: require('@/assets/images/icons/misc/none.png')},
  {value: "1", text:"Requires material of some sort", image:require('@/assets/images/icons/components/material.png')},
  {value: "2", text:"Requires material with a particular worth", image:require('@/assets/images/icons/components/expensive2.png')},
  {value: "3", text:"Requires material with a particular worth that the spell consumes", image:require('@/assets/images/icons/components/expensive3.png')}
];
const schools = ["abjuration","conjuration","divination","enchantment","evocation","illusion","necromancy","transmutation"];

const _spell = {
  "name": "",
  "classes": [],
  "school": "abjuration",
  "level": "0",
  "range": "20 feet",
  "duration": "Up to 1 minute",
  "casting": "1 action",
  "verbal": false,
  "somatic": false,
  "material": "0",
  "materials": null,
  "concentration": false,
  "ritual": false,
  "description": "",
  "atHigherLevel": ""
};

const contentDatabase = ContentDatabase.getFromStorageOrDefault();
console.log("contentDatabase.getSources()", contentDatabase.getSources())

export default {
  name: 'NewSpell',
  props: {
    app: Object
  },
  data: function() { return {
    aoe: aoe,
    aoeSizeType: aoeSizeType,
    classes: classes,
    levels: levels,
    material: material,
    rawQueryText: '',
    schools: schools,
    spell: {..._spell},
    Icons: Icons,
    sources: this.app.contentDatabase.getSources(),
    sourceIndex: "0"
  }},
  computed: {
    aoeOptions: function() {
      return aoe
    },
    classOptions: function() {
      return constants.classes.reduce((prev, c) => {  prev[c] = { value: c, text: c, image: Icons.classIcon(c) }; return prev; }, {});
    },
    levelOptions: function() {
      return [
        { value: '0', text: 'Cantrip' }, { value: '1', text: '1st level' },
        { value: '2', text: '2nd level' }, { value: '3', text: '3rd level' }
      ].concat([4,5,6,7,8,9].map(n => { return { value: n.toString(), text: n + 'th level' }}));
    },
    materialOptions: function() {
      return material;
    },
    schoolOptions: function() {
      return constants.schools.map(s => { return { value: s, text: s, image: Icons.schoolIcon({school: s}) }});
    }
  },
  methods: {
    aSelect: function(e) {
      const aos = document.getElementById("aoesize");
      const value = e;
      const curVal = this.spell.aoe ? this.spell.aoe.type : undefined;
      let prevVal;
      if (curVal) {
        prevVal = this.spell.aoe[aoeSizeType[curVal.toLowerCase()]];
        delete this.spell.aoe[aoeSizeType[curVal.toLowerCase()]];
      } 
      if (!value.match(/none/i)) {
        if (!this.spell.aoe) {
          this.spell.aoe = {
          };
        }
        this.spell = {...this.spell, aoe: {...this.spell.aoe, type: value}};
        this.spell.aoe[aoeSizeType[value.toLowerCase()]] = prevVal || "";
         aos.style.display = "block";
      } else {
        delete this.spell.aoe;
        aos.style.display = "none";
        this.spell = {...this.spell};
      }
      aos.dataset.varname = !value.match(/none/i) ? aoeSizeType[value.toLowerCase()] : "";
    },
    aos: function(e) {
      const { value } = e.target;
      const { varname } = e.target.dataset;
      this.spell.aoe[varname] = value;
      console.log(this.spell.aoe);
    },
    classClick: function(e) {
      const { checked, value, id } = e.target;
      if (checked) {
        if (this.spell.classes.indexOf(value) === -1) {
          this.spell.classes.push(value);
        }
      } else {
        this.spell.classes.splice(this.spell.classes.indexOf(value), 1);
      }
    },
    savespell: function(e) {
      console.log("Save the spell!", JSON.stringify(this.spell), "to source", this.sourceIndex);

      this.spell.classes = this.spell.classes.map(c => c.toLowerCase());
      this.app.contentDatabase.addSpell(this.spell, this.sourceIndex);
      this.app.spells = this.app.contentDatabase.getSpells();
      this.spell = Object.assign({}, _spell);
    }
  },
  created() {
    //creator();

  },
  components: {
    CustomSelect
  }
}
</script>
<style>

.absent {
  opacity: 0.1;
}

textarea.form-control, textarea.form-control:focus {
  border: 1px dashed #686666;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  background: transparent;
}
</style>