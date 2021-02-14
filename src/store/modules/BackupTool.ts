import { CommitRootStateFunction } from '@/types/custom.d';
import * as StorageBlob from '@azure/storage-blob';
import { AuthState } from '@/store/modules/auth';
import * as UserInterface from '@/store/modules/Backup/userInterface';
import * as path from 'path';
import * as azureAPI from '@/store/modules/Backup/azureAPI';
import fs from 'fs';
import readline from 'readline';
import { upload } from '@/store/modules/Backup/azureAPI';
import * as scheduler from '@/store/modules/Backup/scheduler';
import { CronTime } from 'cron';

const state = {
};

interface RootState {
  Auth: AuthState;
}

const actions = {
  CreateUserContainer({ commit, rootState }: CommitRootStateFunction<RootState>) {
    const blobService = StorageBlob.BlobServiceClient.fromConnectionString('***REMOVED***');
    blobService.getContainerClient(rootState.Auth.GUserID).exists()
      .then((value) => {
        if (!value) {
          blobService.createContainer(rootState.Auth.GUserID)
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

    // eslint-disable-next-line no-restricted-syntax
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
  async DownloadSnapshot({ commit, rootState }: CommitRootStateFunction<RootState>, { name, snapshotID }) {
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
