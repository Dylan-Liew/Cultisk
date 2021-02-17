import { CommitRootStateFunction } from '@/types/custom.d';
import * as StorageBlob from '@azure/storage-blob';
import { AuthState } from '@/store/modules/auth';
import * as UserInterface from '@/store/modules/Backup/userInterface';
import * as path from 'path';
import * as azureAPI from '@/store/modules/Backup/azureAPI';
import fs from 'original-fs';
import readline from 'readline';
import { upload } from '@/store/modules/Backup/azureAPI';
import * as scheduler from '@/store/modules/Backup/scheduler';
import { CronTime } from 'cron';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const state = {
  jobID: 0,
  interval: 0,
};

interface BackUpState {
  jobID: number;
  interval: number;
}

interface RootState {
  Auth: AuthState;
}

interface SnapshotData {
  name: string;
  snapshotID: string;
}

const getters = {
  getJobID: (state: BackUpState) => state.jobID,
  getInterval: (state: BackUpState) => state.interval,
};

const mutations = {
  setNewJobID(state: BackUpState, newID: number) {
    state.jobID = newID;
  },
  setNewInterval(state: BackUpState, newInterval: number) {
    state.interval = newInterval;
  },
};

const actions = {
  async CreateUserContainer({ commit, rootState }: CommitRootStateFunction<RootState>) {
    const blobService = StorageBlob.BlobServiceClient.fromConnectionString('***REMOVED***');
    console.log(rootState.Auth.GUserID);
    await blobService.createContainer(rootState.Auth.GUserID);
  },
  AddPath({ commit, rootState }: CommitRootStateFunction<RootState>, newPath: string) {
    UserInterface.addFilePath(path.normalize(newPath));
  },
  async RetrievePaths({ commit, rootState }: CommitRootStateFunction<RootState>) {
    const pathArray = await UserInterface.getFilePaths();
    return pathArray;
  },
  FileUpload({ commit, rootState }: CommitRootStateFunction<RootState>, name: string) {
    upload(name, rootState.Auth.GUserID).then((value) => console.log(value)).catch((err) => console.log(err));
  },
  async ManualUpload({ commit, rootState }: CommitRootStateFunction<RootState>) {
    console.log('starting upload');
    const fileStream = fs.createReadStream(path.join(__dirname, 'pathList.txt'));

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
      // Note: we use the crlfDelay option to recognize all instances of CR LF
      // ('\r\n') in input.txt as a single line break.

    // eslint-disable-next-line no-restricted-syntax
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      try {
        await upload(line, rootState.Auth.GUserID);
      } catch (err) {
        console.log(err);
      }
    }
    console.log('upload finished');
  },
  async GetFileStructure({ commit, rootState }: CommitRootStateFunction<RootState>, folder = '') {
    return azureAPI.getFileJSON(folder, rootState.Auth.GUserID);
  },
  DeleteFile({ commit, rootState }: CommitRootStateFunction<RootState>, name: string) {
    try {
      azureAPI.deleteFile(name, rootState.Auth.GUserID);
      return true;
    } catch (err) {
      console.log(err);
    }
    return false;
  },
  async GetFileList({ commit, rootState }: CommitRootStateFunction<RootState>, folder = '') {
    const fileList = await azureAPI.getFileList(folder, rootState.Auth.GUserID);
    return fileList;
  },
  DownloadFile({ commit, rootState }: CommitRootStateFunction<RootState>, name: string) {
    return azureAPI.downloadFile(name, rootState.Auth.GUserID);
  },
  async GetSnapshots({ commit, rootState }: CommitRootStateFunction<RootState>, name: string) {
    const snapshotList = await azureAPI.getBlobSnapshots(path.normalize(name), rootState.Auth.GUserID);
    return snapshotList;
  },
  async DownloadSnapshot({ commit, rootState }: CommitRootStateFunction<RootState>, { name, snapshotID }: SnapshotData) {
    await azureAPI.downloadSnapshot(name, snapshotID, rootState.Auth.GUserID);
    return true;
  },
  StartSchedulerInterval({ commit, rootState }: CommitRootStateFunction<RootState>, interval: number) {
    const backupJob = scheduler.createJob('test', interval);
    commit('setNewJobID', backupJob);
    commit('setNewInterval', interval);
    return backupJob;
  },
  SetSchedulerInterval({ commit, rootState }: CommitRootStateFunction<RootState>, interval: number) {
    clearInterval(state.jobID);
    const backupJob = scheduler.createJob('test', interval);
    commit('setNewJobID', backupJob);
    commit('setNewInterval', interval);
    return backupJob;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
