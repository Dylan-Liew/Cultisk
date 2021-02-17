import {
  CommitRootStateFunction, DarkScannerData, DarkScannerResponse, DataBreach, PasteData,
} from '@/types/custom.d';
import { AuthState } from '@/store/modules/auth';
import GenerateClient from '@/helpers/request';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  breachedData: [],
  pasteBinData: [],
  breachedPasswords: [],
};

interface RootState {
  Auth: AuthState;
}

export interface DarkWebState {
  breachedData: DataBreach[];
  pasteBinData: PasteData[];
  breachedPasswords: PwExposedResult[];
}

interface PwHashes {
  uuid: string;
  hash: string;
}

interface PwExposedResult {
  uuid: string;
  hashValue: string;
  exposedCount: number;
}

const getters = {
  breachInfo: (state: DarkWebState) => state.breachedData,
  pasteInfo: (state: DarkWebState) => state.pasteBinData,
  breachedPasswords: (state: DarkWebState) => state.breachedPasswords,
};

const actions = {
  async CheckDataBreach({ commit, rootState }: CommitRootStateFunction<RootState>) {
    const instance = GenerateClient(rootState.Auth.token);
    const response = await instance.get('/web-scanner/email/');
    const ResponseData: DarkScannerResponse = response.data;
    if (ResponseData.success) {
      commit('SetBreachData', ResponseData.data);
    }
  },

};

const mutations = {
  SetBreachData: (state: DarkWebState, data: DarkScannerData): void => {
    state.pasteBinData = data.paste;
    state.breachedData = data.breach;
  },
  SetPasswordLeakedData: (state: DarkWebState, data: PwExposedResult[]): void => {
    state.breachedPasswords = data;
  },
};

export default {
  getters,
  state,
  actions,
  mutations,
};
