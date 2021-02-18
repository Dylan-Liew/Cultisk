import {
  CommitRootStateFunction, SpamFilterData, SpamFilterDataResponse,
} from '@/types/custom.d';
import GenerateClient from '@/helpers/request';
import { AuthState } from '@/store/modules/auth';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  emails: [],
  whitelist: [],
};

interface RootState {
  Auth: AuthState;
}

interface EmailInfo {
  body: string;
  message_id: string;
  sender: string;
  subject: string;
}

interface SpamFilterState {
  emails: EmailInfo[];
  whitelist: string[];
}

const getters = {
  allEmails: (state: SpamFilterState) => state.emails,
  whitelist: (state: SpamFilterState) => state.whitelist,
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
  async GetWhiteList({ commit, rootState }: CommitRootStateFunction<RootState>) {
    const instance = GenerateClient(rootState.Auth.token);
    const response = await instance.get('/spam-filter/whitelist/');
    if (response.status === 401) {
      commit('AuthenticationExpired');
    } else {
      const ResponseData: string[] = response.data;
      commit('SetWhitelist', ResponseData);
    }
  },
  async AddNewEntry({ commit, rootState }: CommitRootStateFunction<RootState>, email: string) {
    const instance = GenerateClient(rootState.Auth.token);
    const response = await instance.post('/spam-filter/whitelist/', { email });
    if (response.status === 401) {
      commit('AuthenticationExpired');
    } else {
      const ResponseData: string[] = response.data;
      commit('SetWhitelist', ResponseData);
    }
  },
};

const mutations = {
  SetSpamFilter(state: SpamFilterState, SpamData: SpamFilterData[]): void {
    state.emails = SpamData;
  },
  SetWhitelist(state: SpamFilterState, whitelist: string[]): void {
    state.whitelist = whitelist;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
