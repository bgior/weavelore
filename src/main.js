// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './components/general/App.vue'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/application.css'
import './registerServiceWorker'

Vue.use(BootstrapVue)
Vue.use(VueRouter)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
