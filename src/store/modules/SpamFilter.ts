import {
  CommitRootStateFunction, SpamFilterData, SpamFilterDataResponse,
} from '@/types/custom.d';
import GenerateClient from '@/helpers/request';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  emailInfo: [],
};

interface RootState {
  Auth: {
    token: string;
    GUserID: string;
  };
}

const getters = {
  allEmails: (state: { emailInfo: any }) => state.emailInfo,
};

const actions = {
  async RetrieveSpamFilterInfo({ commit, rootState }: CommitRootStateFunction<RootState>) {
    const instance = GenerateClient(rootState.Auth.token);
    const response = await instance.get('/spam-filter/');
    if (response.status === 401) {
      commit('AuthenticationExpired');
    } else {
      const ResponseData: SpamFilterDataResponse = response.data;
      commit('SetSpamFilter', ResponseData);
    }
  },
};

const mutations = {
  SetSpamFilter(state, SpamData: SpamFilterData[]): void {
    state.emails = SpamData;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
