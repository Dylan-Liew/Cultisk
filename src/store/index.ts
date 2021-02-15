import Vue from 'vue';
import Vuex from 'vuex';
import Globals from '@/store/modules/Globals';
import Auth from '@/store/modules/auth';
import SoftwareUpdater from '@/store/modules/SoftwareUpdater';
import PwManager from '@/store/modules/PasswordManager';
import AntiVirus from '@/store/modules/AntiVirus';
import SpamFilter from '@/store/modules/SpamFilter';
import BackupTool from '@/store/modules/BackupTool';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Globals,
    Auth,
    PwManager,
    SoftwareUpdater,
    AntiVirus,
    SpamFilter,
    BackupTool,
  },
});
