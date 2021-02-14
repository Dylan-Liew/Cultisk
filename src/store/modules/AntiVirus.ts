import { CommitFunction } from '@/types/custom.d';

const zerorpc = require('zerorpc');
/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  MalDetected: 0,
  FileScanned: 0,
  ScannedList: [],
  last_scanned_time: '00:00:00',
  DeletedFileList: [],
};
interface ScanResults {
  FilePath: string;
  malicious: boolean;
}
export interface AVState {
  MalDetected: number;
  FileScanned: number;
  ScannedList: ScanResults[];
  last_scanned_time: string;
  DeletedFileList: DeletedFileResults[];
}

interface AVResponse {
  files_scanned: number;
  mal_detected: number;
  scanned_list: ScanResults[];
  last_scanned_time: string;
}

interface DeletedFileResults {
  FilePath: string;
  timing: string;
}

interface DeletedFileResponse {
  DeletedFileList: DeletedFileResults[];
}

const getters = {
  MalDetected: (state: AVState) => state.MalDetected,
  FileScanned: (state: AVState) => state.FileScanned,
  ScannedList: (state: AVState) => state.ScannedList,
  last_scanned_time: (state: AVState) => state.last_scanned_time,
  deletedFiles: (state: AVState) => state.DeletedFileList,
};

const actions = {
  RetrieveAVInfo({ commit }: CommitFunction, foldername: string) {
    const client = new zerorpc.Client({ heartbeatInterval: 10000 });
    client.connect('tcp://127.0.0.1:4242');
    client.on('error', (error: string) => {
      console.error('RPC client error:', error);
    });
    client.invoke('av_scan', foldername, (error: string, res: string) => {
      const ResObj = JSON.parse(res);
      commit('SetAVInfo', ResObj);
      client.close();
    });
  },
  ResetState({ commit }: CommitFunction) {
    const defaultState = {
      MalDetected: 0,
      FileScanned: 0,
      ScannedList: 0,
      last_scanned_time: 0,
    };
    commit('SetAVInfo', defaultState);
  },
  GetDeletedFiles({ commit }: CommitFunction) {
    const client = new zerorpc.Client({ heartbeatInterval: 10000 });
    client.connect('tcp://127.0.0.1:4242');
    client.on('error', (error: string) => {
      console.error('RPC client error:', error);
    });
    client.invoke('Get_deleted_file', (error: string, res: string) => {
      const ResObj = JSON.parse(res);
      commit('SetDeletedFile', ResObj);
      client.close();
    });
  },
};

const mutations = {
  SetAVInfo: (state: AVState, AvResponse: AVResponse): void => {
    state.ScannedList = AvResponse.scanned_list;
    state.FileScanned = AvResponse.files_scanned;
    state.MalDetected = AvResponse.mal_detected;
    state.last_scanned_time = AvResponse.last_scanned_time;
  },
  SetDeletedFile: (state: AVState, response: DeletedFileResults[]): void => {
    state.DeletedFileList = response;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
