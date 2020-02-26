<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div id="app">
    <Navbar :app="app"/>
    <main class="container-fluid">
      <div v-if="app.contentDatabase.awaitingFetch" class="text-center">
        <img :src="require('@/assets/images/icons/misc/spinner.png')" id="loadingIcon"/>
      </div>
      <router-view v-else :app="app"></router-view>
    </main>
    <Alert ref="alert"/>
    <UpdateNotice v-if="app.appUpdateAvailable && this.$route.path != '/updates'"/>
  </div>
</template>

<script>
import Vue from 'vue';
import VueRouter from 'vue-router';
import Navbar from './Navbar.vue';
import SpellsPage from '../spells/SpellsPage.vue';
import StatsPage from './StatsPage.vue';
import SettingsPage from './SettingsPage.vue';
import OGLPage from './OGLPage.vue';
import TipsPage from './TipsPage.vue';
import AreasPage from './AreasPage.vue';
import AboutPage from './AboutPage.vue';
import NewsPage from './NewsPage.vue';
import UpdatesPage from './UpdatesPage.vue';
import ContentPage from './ContentPage.vue';
import RulesPage from '../rules/RulesPage.vue';
import TestPage from './TestPage.vue';
import NotFound from './NotFound.vue';
import Alert from './Alert.vue';
import UpdateNotice from './UpdateNotice.vue';

import ContentDatabase from '@/util/contentDatabase.js';
import SettingsDatabase from '@/util/settingsDatabase.js';

const timeBetweenAppUpdateChecksInMs = 1000 * 60 * 60 * 1; // 1 hour
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: SpellsPage },
    { path: '/spells/:urlSpellName', component: SpellsPage, props: true },
    { path: '/spells', component: SpellsPage },
    { path: '/rules/:urlRuleName', component: RulesPage, props: true },
    { path: '/rules', component: RulesPage },
    { path: '/stats', component: StatsPage },
    { path: '/settings', component: SettingsPage },
    { path: '/tips', component: TipsPage },
    { path: '/areas', component: AreasPage },
    { path: '/about', component: AboutPage },
    { path: '/news', component: NewsPage },
    { path: '/content', component: ContentPage },
    { path: '/ogl', component: OGLPage },
    { path: '/updates', component: UpdatesPage },
    { path: '/test', component: TestPage },
    { path: '*', component: NotFound }
  ]
})

export default {
  name: 'app',
  router,
  components: {
    Navbar,
    Alert,
    UpdateNotice
  },
  data() {
    const contentDatabase = ContentDatabase.getFromStorageOrDefault();
    const settingsDatabase = SettingsDatabase.getFromStorageOrDefault();
    return {
      app: {
        contentDatabase,
        settingsDatabase,
        spells: [],
        rules: [],
        settings: settingsDatabase.getSettings(),
        appUpdateAvailable: false, // Whether an updated version of the app is awaiting activation
        editionModeOn: false, // Whether we should show the spell editor instead of the normal spell view
        alert: (msg, type, duration) => this.$refs.alert.alert(msg, type, duration), // A helper function to display messages from anywhere
        reloadDatabase: function() { // Fetch the data from the contentDatabase again
          this.spells = this.contentDatabase.getSpells();
          this.rules = this.contentDatabase.getRules();
        }
      },
      alertMessage: null,
      alertType: null,
      lastAppUpdateCheck: new Date()
  }},
  methods: {
    // Let the app know that there's a new app version available
    notifyUpdate() {
      this.app.appUpdateAvailable = true;
    }
  },
  created() {
    // Share the Vue app reference here so that the Service Worker can call notifyUpdate()
    window.vueApp = this;
    this.app.reloadDatabase();
    // If the database is empty, load the SRD
    if (this.app.spells.length == 0 && this.app.rules.length == 0) {
      this.app.contentDatabase.loadURL('/srd.json', () => {
        this.app.reloadDatabase();
      });
    }
  },
  watch: {
    '$route': function() {
      /* Normally the browser would check for ServiceWorker updates every time the user
      navigates to a different page. But since this is a SPA, it only checks on application
      startup, so on the PWA it could take days to update. To fix that, we manually check
      every time the route changes. Limited to once every 1 hour since that's good enough. */
      if (new Date() - this.lastAppUpdateCheck > timeBetweenAppUpdateChecksInMs) {
        this.lastAppUpdateCheck = new Date();
        navigator.serviceWorker.getRegistration().then(reg => {
          if (reg) {
            reg.update();
          }
        });
      }
    }
  }
}
Vue.directive('focus', {
  inserted(el) {
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
  #loadingIcon {
    width: 150px;
    margin-top: 100px;
    animation: spin 1.2s linear infinite;
  }
  @keyframes spin {
    100% { transform: rotate(360deg); }
  }
</style>
