<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <b-modal id="helpModal" :title="topic">

    <div v-if="topic == 'classes'" class="row">
      <div v-for="c in classes" :key="c" class="col-6 col-sm-4 capitalize">
        <img :src="icons.classIcon(c)" alt=""> {{ c }}
      </div>
    </div>

    <div v-if="topic == 'components'" class="row">
      <div v-for="c in [['verbal'], ['somatic'], ['material'], ['expensive2', 'Expensive material, not consumed'], ['expensive3', 'Expensive material, consumed']]" :key="c" class="col-12 capitalize">
        <img :src="require(`@/assets/images/icons/components/${c[0]}.png`)" alt=""> {{ c[1] || c[0] }}
      </div>
      <div class="col-12 pt-3">
        <router-link to="/rules/components">Read more about spell components</router-link>
      </div>
    </div>

    <div v-if="topic == 'schools'" class="row">
      <div v-for="s in schools" :key="s" class="col-6 capitalize">
        <img :src="icons.schoolIcon({school:s})" alt=""> {{ s }}
      </div>
    </div>

    <div slot="modal-footer" class="w-100">
      <b-button variant="primary" size="sm" class="float-right" @click="$bvModal.hide('helpModal')">Close</b-button>
    </div>
  </b-modal>
</template>
<script>
import Icons from '@/util/icons.js';
import constants from '@/util/constants.js';

export default {
  name: 'HelpModal',
  props: {
    app: Object,
    topic: String
  },
  computed: {
    icons() {
      return Icons;
    },
    schools() {
      return constants.schools;
    },
    classes() {
      return constants.classes;
    }
  }
}
</script>
<style>
  #helpModal img {
    width: 30px;
  }
  #helpModal .modal-title {
    text-transform: capitalize;
  }
  #helpModal .capitalize {
    text-transform: capitalize;
  }
</style>
