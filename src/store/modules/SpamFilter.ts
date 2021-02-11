import {
  CommitFunction, CommitRootStateFunction,
  CommitStateFunction, PasswordManagerAllDataResponse, SpamFilterData, SpamFilterDataResponse,
} from '@/types/custom.d';
import generatePassword from 'password-generator';
import GenerateClient from '@/helpers/request';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  emails: [],
};

interface State {
  emails: {};
}

interface RootState extends State {
  token: string;
}

const getters = {
  allEmails: (state: State) => state.emails,
};

const actions = {
  async RetrieveSpamFilterInfo({ commit, rootState }: CommitRootStateFunction<RootState>) {
    const instance = GenerateClient(rootState.token);
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
  SetSpamFilter(state: State, SpamData: SpamFilterData[]): void {
    state.emails = SpamData;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
