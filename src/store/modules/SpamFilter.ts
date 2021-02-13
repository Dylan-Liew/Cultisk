import {
  CommitRootStateFunction, SpamFilterData, SpamFilterDataResponse,
} from '@/types/custom.d';
import GenerateClient from '@/helpers/request';
import { AuthState } from '@/store/modules/auth';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  emails: [],
};

interface RootState {
  Auth: AuthState;
}

const getters = {
  allEmails: (state: { emails: any }) => state.emails,
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
  SetSpamFilter(state: { emails: any }, SpamData: SpamFilterData[]): void {
    state.emails = SpamData;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
