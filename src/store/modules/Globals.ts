import { CommitFunction } from '@/types/custom.d';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

// TODO: change default value for showNav to false after development is done.
const state = {
  showNav: true,
};
interface State {
  showNav: boolean;
}

const getters = {
  navStatus: (state: State) => state.showNav,
};

const actions = {
  HideNav({ commit }: CommitFunction) {
    commit('SetNavStatus', false);
  },
  ShowNav({ commit }: CommitFunction) {
    commit('SetNavStatus', true);
  },
};

const mutations = {
  SetNavStatus: (state: State, value: boolean): void => {
    state.showNav = value;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
