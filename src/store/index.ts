import Vue from 'vue';
import Vuex from 'vuex';
import PwManager from '@/store/modules/PasswordManager';
import Auth from '@/store/modules/auth';
import SoftwareUpdater from '@/store/modules/SoftwareUpdater';
import AntiVirus from '@/store/modules/AntiVirus';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    PwManager,
    Auth,
    SoftwareUpdater,
    AntiVirus,
  },
});
