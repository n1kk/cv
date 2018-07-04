import Vue from 'vue'
import app from './app.vue'

import VueRouter from 'vue-router';
Vue.use(VueRouter)

const routes = ENV_ROUTES.map(path => ({ path: '/'+path, component: require('~/layouts/'+path).default}))

const router = new VueRouter({
  routes,
});

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

library.add(fab)
library.add(fas)
library.add(far)

import VueMarkdown from 'vue-markdown'

Vue.component('fa', FontAwesomeIcon)
Vue.component('md', VueMarkdown)

new Vue({
  el: '#app',
  //render: h => h(App),
  template: '<app/>',
  components: { app },
  router,
})
