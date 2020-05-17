<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row text-left justify-content-center">
    <div class="col-12 col-md-10 col-xl-8 about">
      <h1 class="my-4">About<img src="@/assets/images/logo/logo64.png" style="filter: contrast(0) brightness(0.8)" alt=""/></h1>
      <div class="row">
        <div class="col-12 col-md-4 about-image" :style="{ backgroundImage: `url(${require('@/assets/images/logo/logo_large.jpg')})`}">
        </div>
        <div class="col-12 col-md-8">
          <h2>WeaveLore {{ appVersion }}</h2>
          <p>This project is open-source and released under <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" target="_blank">GNU AGPL v3</a>. You can find the repository and more information on <a href="https://github.com/bgior/weavelore" target="_blank">GitHub</a>.</p>
          <p>The SRD content included is Open Game Content, which is distributed under <router-link to="/ogl">OGL</router-link> and not AGPL.</p>
          <p>This project is not affiliated in any way to Wizards of the Coast.</p>
          <p>Join us on <a href="https://www.reddit.com/r/WeaveLore">Reddit</a>!</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .about-image {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    min-height: 256px;
  }
</style>
<script>
import constants from '@/util/constants.js';

export default {
  name: 'AboutPage',
  props: {
    app: Object
  },
  computed: {
    appVersion() {
      return constants.appVersion;
    }
  },
  metaInfo: {
    title: "About - WeaveLore",
    meta: [
      { vmid: "description", name: "description", content: "Learn more about WeaveLore, a free and open-source web application to browse D&D 5e spells. More information about the project is available on GitHub." }
    ]
  }
}
</script>
