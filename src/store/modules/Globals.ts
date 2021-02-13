import { CommitFunction, CommitRootSateStateFunction, CommitStateFunction } from '@/types/custom.d';
import { AuthState } from '@/store/modules/auth';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

// TODO: change default value for showNav to false after development is done.
const state = {
  showNav: false,
};
export interface GlobalState {
  showNav: boolean;
}

interface RootState {
  Auth: AuthState;
}

const getters = {
  navStatus: (state: GlobalState) => state.showNav,
};

const actions = {
  ToggleNav({ commit, rootState, state }: CommitRootSateStateFunction<GlobalState, RootState>) {
    if (rootState.Auth.authenticated) {
      commit('SetNavStatus', true);
    } else {
      commit('SetNavStatus', !state.showNav);
    }
  },
};

const mutations = {
  SetNavStatus: (state: GlobalState, value: boolean): void => {
    state.showNav = value;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
