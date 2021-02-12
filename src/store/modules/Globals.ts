import { CommitFunction, CommitRootSateStateFunction, CommitStateFunction } from '@/types/custom.d';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

// TODO: change default value for showNav to false after development is done.
const state = {
  showNav: false,
};
interface State {
  showNav: boolean;
}

interface RootState extends State {
  authenticated: boolean;
}

const getters = {
  navStatus: (state: State) => state.showNav,
};

const actions = {
  ToggleNav({ commit, rootState, state }: CommitRootSateStateFunction<State, RootState>) {
    if (rootState.authenticated) {
      commit('SetNavStatus', true);
    } else {
      commit('SetNavStatus', !state.showNav);
    }
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
