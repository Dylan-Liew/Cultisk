import Vue from 'vue';
import VueSidebarMenu from 'vue-sidebar-menu';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import VueMaterial from 'vue-material';
import App from './App.vue';
import router from './router';
import store from './store';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';

Vue.use(VueMaterial);
Vue.use(VueSidebarMenu);
Vue.config.productionTip = false;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
