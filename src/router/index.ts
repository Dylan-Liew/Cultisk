import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import SoftwareUpdater from '@/views/SoftwareUpdater.vue';
import Welcome from '@/views/Welcome.vue';
import OAuth from '@/components/Welcome/OAuth.vue';
import OAuthExpired from '@/components/Error/OAuthExpired.vue';
import SetupPasswordManager from '@/components/Welcome/SetupPasswordManager.vue';
import Error from '@/views/Error.vue';
import AntiVirus from '@/views/AntiVirus.vue';
import AntiVirusIndex from '@/components/AntiVirus/AntiVirusIndex.vue';
import ScheduledScanSettings from '@/components/Settings/ScheduledScanSettings.vue';
import DeletedFilesIndex from '@/components/AntiVirus/DeletedFilesIndex.vue';
import PasswordManager from '@/views/PasswordManager/PasswordManager.vue';
import WebScannerDashboard from '@/views/PasswordManager/WebScannerDashboard.vue';
import Backup from '@/views/Backup.vue';
import EmailFilter from '@/views/EmailFilter.vue';
import EmailIndex from '@/components/EmailFilter/EmailIndex.vue';
import WhitelistManagement from '@/components/EmailFilter/WhitelistManagement.vue';
import Settings from '@/views/Settings.vue';
import SettingsIndex from '@/components/Settings/SettingsIndex.vue';
import ChangeMasterPassword from '@/components/Settings/ChangeMasterPassword.vue';
import ScheduledBackupSettings from '@/components/Settings/ScheduledBackupSettings.vue';
import VaultAltAuth from '@/components/Settings/VaultAltAuth.vue';
import Unlocking from '@/views/PasswordManager/Unlocking.vue';
import PasswordManagerIndex from '@/components/PasswordManager/PasswordManagerIndex.vue';

Vue.use(VueRouter);

// Hello Page
// - Hello Please(OAuth)
// - Check OAuth Display Master Password Form
//
// Home (OAuth)
// - Welcome (Animation)
// - Show Last Scanned
// - Quick Scan (Software Scan, Antivirus Scan) (Navigate To New Page) (Not Yet)
// - Features Explanation with Route
//
// Anti Virus (last scan time)
// - Scan - Select file/Folder to scan
// - List of Deleted Files (Shows Only, Filter by Time)
//
// Software Updater
// - Scan - Download
//
// Password Manager (Require Master password Password)
// - Password  Manager - Password Generator (All/Favourite)
// - Password/Emails Leaked Dashboard
// - Credit Cards
//
// Backup
// - View Backups (Snapshots) - Upload File - Download
//
// Email Filtering
// - View Filtered Email (Untrash)
// - Whitelist Management - Add Whitelist
//
// Settings
// - Change Master password (Password Strength Checker)
// - Alternative Authentication Method Settings
// - Scheduled Backup Settings
// - AV scheduling (Try)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/error/',
    name: 'error page',
    component: Error,
    children: [
      // OAuthExpired will be rendered inside Error's <router-view>
      // when /error/oauth is matched
      { path: 'oauth', component: OAuthExpired },
    ],
  },
  {
    path: '/welcome/',
    name: 'welcome',
    component: Welcome,
    children: [
      // OAuth will be rendered inside Welcome <router-view>
      // when /welcome/oauth is matched
      { path: 'oauth', component: OAuth },

      { path: 'password-manager', component: SetupPasswordManager },
    ],
  },
  {
    path: '/anti-virus/',
    component: AntiVirus,
    children: [
      // AntiVirusIndex will be rendered inside Antivirus <router-view>
      // when /anti-virus/ is matched
      { path: '', component: AntiVirusIndex, name: 'Antivirus Home' },
      { path: 'deleted-files', component: DeletedFilesIndex },
    ],
  },
  {
    path: '/software-updater/',
    component: SoftwareUpdater,
    name: 'Software Updater Home',
  },
  {
    path: '/password-manager/',
    component: PasswordManager,
    name: 'Password Manager',
    children: [
      {
        name: 'PasswordManagerIndex',
        path: '',
        component: PasswordManagerIndex,
      },
      // {
      //   name: 'Card creation',
      //   path: 'card-create',
      //   component: CardCreate,
      // },
      // {
      //   name: 'Password creation',
      //   path: 'password-create',
      //   component: PasswordCreate,
      // },
      // {
      //   name: 'Card details',
      //   path: 'card/:uuid',
      //   component: CardDetails,
      // },
      // {
      //   name: 'Password Details',
      //   path: 'password/:uuid',
      //   component: PasswordDetails,
      // },
    ],
  },
  {
    path: '/dark-web-dash/',
    name: 'Dashboard Dark web',
    component: WebScannerDashboard,
  },
  {
    path: '/password-manager/unlock/',
    name: 'Unlock Password Manager',
    component: Unlocking,
  },
  {
    name: 'Backup',
    path: '/backup/',
    component: Backup,
  },
  {
    path: '/email-filter/',
    component: EmailFilter,
    children: [
      // EmailIndex will be rendered inside EmailFilter <router-view>
      // when /email-filter/ is matched
      { path: '', component: EmailIndex },
      { path: 'whitelist', component: WhitelistManagement, name: 'Email Filter Home' },
    ],
  },
  {
    path: '/settings/',
    component: Settings,
    children: [
      { path: '', component: SettingsIndex, name: 'App settings' },
      { path: 'antivirus-schedule', component: ScheduledScanSettings },
      { path: 'password-manager-master-change', component: ChangeMasterPassword },
      { path: 'backup-schedule', component: ScheduledBackupSettings },
      { path: 'password-manager-alt', component: VaultAltAuth },
    ],
  },
];

const router = new VueRouter({
  routes,
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
});

export default router;
