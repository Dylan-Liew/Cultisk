import Backup from '@/views/Backup.vue';
import { CommitFunction, CommitRootStateFunction } from '@/types/custom.d';
import * as StorageBlob from '@azure/storage-blob';

const state = {
};

interface RootState {
  Auth: {
    GUserID: string;
  };
}

interface BackupDataInt {
  GUserID: string;
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
};

export default {
  state,
  actions,
};
