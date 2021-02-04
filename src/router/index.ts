import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/password-manager',
    name: 'Password Manager',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "password-manager" */ '../views/PasswordManager/PasswordManager.vue'),
  },
  {
    path: '/password-manager/add-password',
    name: 'Add Password',
    component: () => import(/* webpackChunkName: "password-manager" */ '../views/PasswordManager/AddPassword.vue'),
  },
  {
    path: '/software-updater',
    name: 'Software Updater',
    component: () => import(/* webpackChunkName: "software-updater" */ '../views/SoftwareUpdater/SoftwareUpdater.vue'),
  },
  {
    path: '/anti-virus',
    name: 'Anti Virus',
    component: () => import(/* webpackChunkName: "anti-virus" */ '../views/AntiVirus/AntiVirus.vue'),
  },
];

const router = new VueRouter({
  routes,
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
});

export default router;
