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

interface DarkWebState {
  breachedData: DataBreach[];
  pasteBinData: PasteData[];
  breachedPasswords: PwExposedResult[];
}

interface PwHashes {
  uuid: string;
  hash: string;
}

interface PwExposedResult {
  hashValue: string;
  exposedCount: number;
}

function hashExist(raw: string, hash: string) {
  const hashResult = raw.split('|');
  const hashResultParsed: PwExposedResult[] = hashResult.map((x) => {
    const [hashSuffix, exposedCountS] = x.split(':');
    const hashValue = `${hash.slice(0, 5)}${hashSuffix}`;
    const exposedCount = Number(exposedCountS);
    return { hashValue, exposedCount };
  });
  const result: PwExposedResult[] = hashResultParsed.filter((obj) => obj.hashValue === hash);
  if (result.length === 1) {
    return result[0];
  }
  console.log(result);
  return { hashValue: hash, exposedCount: 0 };
}

const getters = {
  breachInfo: (state: DarkWebState) => state.breachedData,
  pasteInfo: (state: DarkWebState) => state.pasteBinData,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const actions = {
  async CheckDataBreach({ commit, rootState }: CommitRootStateFunction<RootState>) {
    const instance = GenerateClient(rootState.Auth.token);
    const response = await instance.get('/web-scanner/email/');
    const ResponseData: DarkScannerResponse = response.data;
    if (ResponseData.success) {
      commit('SetBreachData', ResponseData.data);
    }
  },
  async CheckPasswordLeaked({ commit, rootState, rootGetters }: CommitRootStateFunction<RootState>) {
    const instance = GenerateClient(rootState.Auth.token);
    const hashes: PwHashes[] = rootGetters.GetPasswordHashes();
    const result = hashes.map(async (x) => {
      const query = x.hash.slice(0, 5);
      const response = await instance.get(`/web-scanner/password/${query}`);
      const ResponseData: string = response.data;
      return hashExist(ResponseData, x.hash);
    });
    commit('SetPasswordLeakedData', result);
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
