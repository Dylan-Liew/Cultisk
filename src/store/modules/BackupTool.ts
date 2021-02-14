import Backup from '@/views/Backup.vue';
import { CommitFunction, CommitRootStateFunction } from '@/types/custom.d';
import * as StorageBlob from '@azure/storage-blob';
import { AuthState } from '@/store/modules/auth';
import * as UserInterface from '@/Backup/userInterface';
import * as path from 'path';
import * as azureAPI from '@/Backup/azureAPI';
import fs from 'fs';
import readline from 'readline';
import { upload } from '@/Backup/azureAPI';
import * as scheduler from '@/Backup/scheduler';
import { CronTime } from 'cron';

const state = {
};

interface RootState {
  Auth: AuthState;
}

const actions = {
  RetrieveBackupInfo({ commit, rootState }: CommitRootStateFunction<RootState>) {
    const userID = rootState.Auth.GUserID!;
    process.env.CONTAINER_NAME = userID;
    process.env.AZURE_STORAGE_CONNECTION_STRING = '***REMOVED***';
    const blobService = StorageBlob.BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    blobService.getContainerClient(process.env.CONTAINER_NAME).exists()
      .then((value) => {
        if (!value) {
          blobService.createContainer(process.env.CONTAINER_NAME!)
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  },
  AddPath({ commit, rootState }: CommitRootStateFunction<RootState>, newPath: string) {
    UserInterface.addFilePath(path.normalize(newPath));
  },
  async RetrievePaths({ commit, rootState }: CommitRootStateFunction<RootState>) {
    const pathArray = await UserInterface.getFilePaths();
    return pathArray;
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

    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      try {
        await upload(line);
      } catch (err) {
        console.log(err);
      }
    }
    console.log('upload finished');
  },
  async GetFileStructure({ commit, rootState }: CommitRootStateFunction<RootState>, folder = '') {
    return azureAPI.getFileJSON(folder);
  },
  DeleteFile({ commit, rootState }: CommitRootStateFunction<RootState>, name: string) {
    try {
      azureAPI.deleteFile(name);
      return true;
    } catch (err) {
      console.log(err);
    }
    return false;
  },
  DownloadFile({ commit, rootState }: CommitRootStateFunction<RootState>, name: string) {
    return azureAPI.downloadFile(name);
  },
  async GetSnapshots({ commit, rootState }: CommitRootStateFunction<RootState>, name: string) {
    const snapshotList = await azureAPI.getBlobSnapshots(path.normalize(name));
    return snapshotList;
  },
  async DownloadSnapshot({ commit, rootState }: CommitRootStateFunction<RootState>, name: string, snapshotID: string) {
    return azureAPI.downloadSnapshot(name, snapshotID);
  },
  GetNextUploads({ commit, rootState }: CommitRootStateFunction<RootState>, i: number) {
    return scheduler.BackupJob.nextDates(i);
  },
  SetSchedulerInterval({ commit, rootState }: CommitRootStateFunction<RootState>, interval: string) {
    const cronInterval = new CronTime(interval);
    scheduler.BackupJob.setTime(cronInterval);
    return true;
  },
};

export default {
  state,
  actions,
};
