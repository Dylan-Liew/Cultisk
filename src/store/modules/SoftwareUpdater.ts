import { CommitFunction } from '@/types/custom.d';

const zerorpc = require('zerorpc');
/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  software: [],
};

interface SoftwareInfo {
  name: string;
  version: string;
  publisher: string;
  title: string;
  link: string;
  lat_version: string;
  download_link: string;
}

interface State {
  software: SoftwareInfo[];
}

const getters = {
  allSoftware: (state: State) => state.software,
};

const actions = {
  RetrieveSoftwareInfo({ commit }: CommitFunction) {
    const client = new zerorpc.Client({ heartbeatInterval: 10000 });
    client.connect('tcp://127.0.0.1:4242');
    client.on('error', (error: string) => {
      console.error('RPC client error:', error);
    });
    client.invoke('software_update_scan', (error: string, res: string) => {
      const ResObj = JSON.parse(res);
      console.log(ResObj);
      commit('SetSoftwareList', ResObj);
      client.close();
    });
  },
};

const mutations = {
  SetSoftwareList: (state: State, software: SoftwareInfo[]): void => {
    state.software = software;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
