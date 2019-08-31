<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="spell-details">
    <div class="spell-head">
      <img :src="icons.schoolIcon(spell)" class="spell-school clickable" @click="helpFor('schools')" title="School"/>
      <div class="spell-title">
        <div class="spell-name">{{ spell.name }}</div>
        <div class="spell-type">{{ prettyLevel }} {{ spell.school }}</div>

      </div>
      <div class="spell-actions">
        <div class="spell-close d-none d-md-block" @click="$emit('clear-spell')">
          <img :src="require('@/assets/images/icons/misc/close.png')"/>
        </div>
        <div :class="`spell-favorite ${favorited() ? 'favorited' : ''}`" @click="favoriteSpell">
          <img :src="require('@/assets/images/icons/misc/favorite.png')"/>
        </div>
      </div>
    </div>
    <div class="row spell-features">
      <div class="col-6 col-lg-4 col-xl-3">
        <router-link to="/rules/range" title="Range">
          <img :src="icons.rangeIcon(spell)"/> {{ spell.range }}
        </router-link><br/>
        <img :src="icons.durationIcon(spell)" title="Duration"/> {{ spell.duration }}<br/>
        <template v-if="spell.concentration"><img :src="require('@/assets/images/icons/spell_features/concentration.png')" title="Spell requires concentration"/> Concentration<br/></template>
        <router-link to="/rules/casting-time" title="Casting time">
          <img :src="icons.castingIcon(spell)"/> {{ spell.casting }}
        </router-link><br/>
        <template v-if="spell.ritual" title="Spell can be cast as ritual"><img :src="require('@/assets/images/icons/spell_features/ritual.png')"/> Ritual</template>
      </div>
      <div class="col-6 col-lg-4 col-xl-3">
        <div @click="helpFor('classes')" title="Classes">
          <img v-for="icon in icons.classIcons(spell)" :src="`${icon}`" :key="icon" class="clickable"/>
        </div>
        <div @click="helpFor('components')" title="Components">
          <img v-for="icon in icons.componentIcons(spell)" :src="icon" :key="icon" class="clickable">
        </div>
        <template v-if="spell.atHigherLevel">
          <router-link to="/rules/casting-a-spell-at-a-higher-level" title="Spell improves when cast with higher level slot">
            <img :src="require('@/assets/images/icons/spell_features/scalable.png')"/> Scalable
          </router-link>
        </template>
      </div>
      <div class="d-none d-lg-block col-lg-4 col-xl-6">
        <div title="Which book/source this spell originates from">
          <router-link to="/content">
            <img :src="require('@/assets/images/icons/spell_features/source.png')"/> {{ spell.source }}
          </router-link>
        </div>
        <div v-if="spell.material > 0" title="Materials" v-html="spell.materials"></div>
      </div>
    </div>
    <div class="spell-description" v-html="prettyDescription" @click="handleDescriptionClick"></div>
    <div v-if="spell.atHigherLevel" v-html="prettyHigherLevel" class="spell-higher">
    </div>
    <Diagram :range="numericRange" :aoe="spell.aoe" title="Range visualization"/>
    <div class="d-block d-lg-none mobile-foot">
      <img :src="require('@/assets/images/icons/spell_features/source.png')" title="Which book/source this spell originates from"/> {{ spell.source }}<br/>
      <div v-if="spell.material > 0" title="Materials" v-html="prettyMaterials"></div>
    </div>
    <HelpModal :app="app" :topic="helpTopic"/>
  </div>
</template>

<script>
import HelpModal from './HelpModal.vue';
import Diagram from './Diagram.vue';
import Icons from '@/util/icons.js';
import TextBeautifier from '@/util/textBeautifier.js';

export default {
  name: 'SpellView',
  components: {
    HelpModal,
    Diagram
  },
  data() { return {
    helpTopic: null
  }},
  props: {
    app: Object,
    spell: Object
  },
  computed: {
    prettyLevel() {
      var pretty;
      switch(this.spell.level) {
        case 0:
          pretty = "Cantrip"
          break;
        case 1:
          pretty = "1st level";
          break;
        case 2:
          pretty = "2nd level"
          break;
        case 3:
          pretty = "3rd level"
          break;
        default:
          pretty = this.spell.level + "th level"
      }
      return pretty;
    },
    icons() {
      return Icons;
    },
    prettyDescription() {
      return TextBeautifier.beautify(this.spell.description);
    },
    prettyHigherLevel() {
      return TextBeautifier.colorize(this.spell.atHigherLevel).replace('<p>', `<p><img src="${require('@/assets/images/icons/spell_features/scalable.png')}"> `);
    },
    prettyMaterials() {
      return this.spell.materials.replace('<p>', `<p><img src="${require('@/assets/images/icons/components/material.png')}"> `);
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
    favorited() {
      return this.app.settings.favorites.has(this.spell.codename);
    },
    helpFor(topic) {
      this.helpTopic = topic;
      this.$bvModal.show("helpModal");
    },
    favoriteSpell() {
      if (this.favorited()) {
        this.app.settings.favorites.delete(this.spell.codename);
      } else {
        this.app.settings.favorites.add(this.spell.codename);
      }
      this.$forceUpdate(); // OPTIMIZE: Vue does not react to changes within the Set, so this was required. Look for a more elegant way?
      this.app.settingsDatabase.saveToStorage();
    },
    handleDescriptionClick(evt) {
      if (evt.target.className == 'dynamic-link') {
        this.$router.push('/rules/' + evt.target.innerText.replace(/ /g, "-"));
      }
    }
  },
  watch: {
    // spell() {
    //   // Make the dynamically generated links in the description work (OPTIMIZE: is there a more Vueish way to do this?)
    //   console.log(document.getElementsByClassName("dynamic-link"));
    //   for (let dynamicLink of document.getElementsByClassName("dynamic-link")) {
    //     console.log(1);
    //     dynamicLink.addEventListener('click', evt => {
    //       this.$router.push('/rules/' + evt.currentTarget.innerText);
    //     });
    //   }
    // }
  }
}
</script>

<style>
.spell-details {
  padding-top: 10px;
  text-align: left;
  font-size: 16px;
}
.spell-head {
  display: flex;
  justify-content: space-between;
}
.spell-title {
  padding-left: 10px;
  width: 100%;
}
.spell-actions img {
  width: 24px;
  transition: filter 0.3s, opacity 0.3s;
  opacity: 0.3;
  filter: saturate(0%);
}
.favorited > img {
  filter: saturate(100%);
  opacity: 1;
}
.spell-actions > div {
  cursor: pointer;
  padding: 3px;
}
.spell-name {
  font-size: 22px;
  font-weight: bold;
}
.spell-type {
  font-size: 16px;
  font-style: italic;
}
.spell-school {
  flex-grow: 0;
  height: 64px;
}
.spell-features {
  margin: 5px 0px !important; /* It shows an unnecessary vertical scrollbar if margin-right is left inherited */
  padding: 8px 0px;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
}
.spell-features img, .mobile-foot img {
  height: 26px;
}
.spell-features a {
  color: white;
}
.spell-description {
  text-align: justify;
}
.sx-die rt {
  margin-bottom: -3px;
  opacity: 0.3;
}
.spell-higher {
  border: 1px dashed #686666;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
}
.spell-higher img {
  height: 22px;
  margin-right: 4px;
}
.spell-higher p {
  margin-bottom: 0;
}
.sx-distance { color: #b3d0ff; }
.sx-time { color: #d3b3ff; }
.sx-weight { color: #ffb3b3; }
.sx-sthrow { color: #fff7b3; }
.sx-advantage { color: #b3ffb8; }
.sx-disadvantage { color: #ffb3b3; }
.sx-life { color: #ffb3b3; }
.sx-attack { color: #ffcab3; }
.sx-die { color: #ffeab3; }

/* Make favorite hover effect work only on non-touch devices, because otherwise it looks favorited after un-favoriting */
@media (pointer: fine) {
  .spell-close:hover img, .spell-favorite:hover img {
    filter: saturate(100%);
    opacity: 1;
  }
}
/* Make favorite button easier to touch on mobile */
@media (max-width: 767px) {
  .spell-favorite {
    padding: 15px !important;
  }
  .spell-favorite > img {
    width: 32px;
  }
}
</style>
