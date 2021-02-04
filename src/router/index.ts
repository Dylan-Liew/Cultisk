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
    path: '/password-manager/credit-cards',
    name: 'Credit Cards',
    component: () => import(/* webpackChunkName: "password-manager" */ '../views/PasswordManager/CreditCards.vue'),
  },
  {
    path: '/password-manager/password-generator',
    name: 'Password Generator',
    component: () => import(/* webpackChunkName: "password-manager" */ '../views/PasswordManager/PasswordGenerator.vue'),
  },
  {
    path: '/password-manager/change-master-pass',
    name: 'Change Master Password',
    component: () => import(/* webpackChunkName: "password-manager" */ '../views/PasswordManager/ChangeMasterPassword.vue'),
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
  {
    path: '/anti-virus/scheduled-scan',
    name: 'Scheduled Scan',
    component: () => import(/* webpackChunkName: "anti-virus" */ '../views/AntiVirus/ScheduledScan.vue'),
  },
  {
    path: '/backup',
    name: 'Backup',
    component: () => import(/* webpackChunkName: "backup" */ '../views/Backup/Backup.vue'),
  },
  {
    path: '/backup/upload-files',
    name: 'Upload Files',
    component: () => import(/* webpackChunkName: "backup" */ '../views/Backup/Uploadfiles.vue'),
  },
  {
    path: '/backup/scheduled-backup-settings',
    name: 'Scheduled Backup Settings',
    component: () => import(/* webpackChunkName: "backup" */ '../views/Backup/ScheduledBackupSettings.vue'),
  },
  {
    path: '/email-filtering',
    name: 'Email Filtering',
    component: () => import(/* webpackChunkName: "email-filtering" */ '../views/EmailFiltering/EmailFilter.vue'),
  },
  {
    path: '/email-filtering/whitelist-management',
    name: 'Whitelist Management',
    component: () => import(/* webpackChunkName: "email-filtering" */ '../views/EmailFiltering/WhitelistManagement.vue'),
  },
];

const router = new VueRouter({
  routes,
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
});

export default router;
