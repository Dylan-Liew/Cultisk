import Vue from 'vue';
import Vuex from 'vuex';
import PwManager from '@/store/modules/PasswordManager';
import Auth from '@/store/modules/auth';
import SoftwareUpdater from '@/store/modules/SoftwareUpdater';
import AntiVirus from '@/store/modules/AntiVirus';
import SpamFilter from '@/store/modules/SpamFilter';
import Globals from '@/store/modules/Globals';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Globals,
    PwManager,
    Auth,
    SoftwareUpdater,
    AntiVirus,
    SpamFilter,
  },
});
