<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div id="app">
    <Navbar :app="app"/>
    <main class="container-fluid">
      <router-view :app="app"></router-view>
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import VueRouter from 'vue-router'
import Navbar from './Navbar.vue'
import SpellsPage from '../spells/SpellsPage.vue'
import StatsPage from './StatsPage.vue'
import WelcomePage from './WelcomePage.vue'
import SettingsPage from './SettingsPage.vue'
import OGLPage from './OGLPage.vue'
import TipsPage from './TipsPage.vue'
import AreasPage from './AreasPage.vue'
import AboutPage from './AboutPage.vue'
import NewsPage from './NewsPage.vue'
import ContentPage from './ContentPage.vue'
import ComingSoon from './ComingSoon.vue'
import TestPage from './TestPage.vue'
import NewSpell from './NewSpell.vue'
import NotFound from './NotFound.vue'

import ContentDatabase from '@/util/contentDatabase.js'
import SettingsDatabase from '@/util/settingsDatabase.js'

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: SpellsPage },
    { path: '/spells/:urlSpellName', component: SpellsPage, props: true },
    { path: '/spells', component: SpellsPage },
    { path: '/rules', component: ComingSoon },
    { path: '/welcome', component: WelcomePage },
    { path: '/stats', component: StatsPage },
    { path: '/settings', component: SettingsPage },
    { path: '/tips', component: TipsPage },
    { path: '/areas', component: AreasPage },
    { path: '/about', component: AboutPage },
    { path: '/news', component: NewsPage },
    { path: '/content', component: ContentPage },
    { path: '/ogl', component: OGLPage },
    { path: '/test', component: TestPage },
    { path: '/newspell', component: NewSpell },
    { path: '*', component: NotFound }
  ]
})

export default {
  name: 'app',
  router,
  components: {
    Navbar
  },
  data: () => {
    const contentDatabase = ContentDatabase.getFromStorageOrDefault();
    const settingsDatabase = SettingsDatabase.getFromStorageOrDefault();
    return {
      app: {
        contentDatabase,
        settingsDatabase,
        spells: contentDatabase.getSpells(),
        settings: settingsDatabase.getSettings(),
      }
  }},
  methods: {

  }
}
Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  }
})
</script>

<style>
  body {
    background-color: #1b1b1b !important;
  }
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: white;
    background-color: #1b1b1b !important;
    font-family: 'Ubuntu', Helvetica, Arial, sans-serif !important;
  }
  @font-face {
    font-family: 'Ubuntu';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Ubuntu Regular'), local('Ubuntu-Regular'), url(/fonts/ubuntu.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
</style>
