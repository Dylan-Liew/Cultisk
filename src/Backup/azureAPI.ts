const StorageBlob = require('@azure/storage-blob');
const BlobChangefeed = require('@azure/storage-blob-changefeed');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const stream = require('stream');
const crypto = require('crypto');
const _ = require('lodash');

const connectStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = StorageBlob.BlobServiceClient.fromConnectionString(connectStr);
const containerClient = blobServiceClient.getContainerClient('test');

function md5File(path) {
  return new Promise((resolve, reject) => {
    const output = crypto.createHash('md5');
    const input = fs.createReadStream(path);

    input.on('error', (err) => {
      reject(err);
    });

    output.once('readable', () => {
      resolve(output.read().toString('hex'));
    });

    input.pipe(output);
  });
}

async function walk(dir) {
  let files = [];
  files = await fsp.readdir(dir);
  files = await Promise.all(files.map(async (file) => {
    const filePath = path.join(dir, file);
    const stats = await fsp.stat(filePath);
    if (stats.isDirectory()) return walk(filePath);
    if (stats.isFile()) return filePath;
  }));

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

async function upload(filePath: string) {
  const normPath: string = path.normalize(filePath);
  if (fs.existsSync(normPath) && fs.lstatSync(normPath).isDirectory()) {
    const listFile: string[] = await walk(normPath);
    // eslint-disable-next-line no-restricted-syntax
    for (const value of listFile) {
      // eslint-disable-next-line no-await-in-loop
      await upload(value);
    }
  } else if (fs.existsSync(normPath) && fs.lstatSync(normPath).isFile()) {
    if (await blobServiceClient.getContainerClient('test').getBlockBlobClient(normPath).exists()) {
      const localHash = await md5File(normPath);
      const cloudProperties = await blobServiceClient.getContainerClient('test').getBlockBlobClient(normPath).getProperties();
      const cloudHash = cloudProperties.contentMD5.toString('hex');
      if (localHash !== cloudHash) {
        await blobServiceClient.getContainerClient('test').getBlockBlobClient(normPath).createSnapshot();
        await blobServiceClient.getContainerClient('test').getBlockBlobClient(normPath).uploadFile(normPath);
      }
    } else {
      const resp = await blobServiceClient.getContainerClient('test').getBlockBlobClient(normPath).uploadFile(normPath);
    }
  } else {
    console.log(`File does not exist${normPath}`);
  }
}

async function getFileList(folder = '') {
  let fileJSON = {};
  function parse(matches: string[]) {
    const temp = {};
    if (matches.length === 1) {
      temp[matches[0]] = {};
      return temp;
    }
    temp[matches[0]] = temp[matches[0]] || {};
    temp[matches[0]] = parse(matches.slice(1));
    console.log(temp);
    return temp;
  }
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of blobServiceClient.getContainerClient('test').listBlobsFlat()) {
    const reg = /[^\/]+/g;
    const matches = item.name.match(reg);
    fileJSON = _.merge(fileJSON, parse(matches));
  }
  return fileJSON;
}

async function getBlobSnapshots(name: string) {
  const snapList = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const value of blobServiceClient.getContainerClient('test').listBlobsFlat({ prefix: name, includeSnapshots: true })) {
    if (value.snapshot) {
      snapList.push({ lastModified: value.properties.lastModified, snapshotTime: value.snapshot });
    }
  }
  return snapList;
}

interface DownloadFileResponse {
  metadata: {
    path: string;
  };
}
function downloadFile(name: string) {
  containerClient.getBlobClient(name).download()
    .then(
      (resp: DownloadFileResponse) => {
        const filePath = resp.metadata.path;
        const writeStream = fs.createWriteStream(name);
        const readStream = resp.readableStreamBody;
        stream.pipeline(
          readStream,
          writeStream,
          (err: object) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Pipeline finish');
            }
          },
        );
      },
    )
    .catch((e) => console.log(e));
}

async function downloadSnapshot(name: string, snapshot: string) {
  containerClient.getBlobClient(name).withSnapshot(snapshot).download()
    .then(
      (resp) => {
        console.log(fs.statSync(name, (err) => console.log(err)));
        (async () => {
          await fsp.writeFile(name + snapshot.replace(/[^a-zA-Z0-9]/g, ''), Buffer.from(''), { flag: 'w' });
        })();
        const writeStream = fs.createWriteStream(name + snapshot.replace(/[^a-zA-Z0-9]/g, ''), { flags: 'w', mode: 0o666 });
        const readStream = resp.readableStreamBody;
        stream.pipeline(
          readStream,
          writeStream,
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Pipeline finish');
            }
          },
        );
      },
    )
    .catch((e) => console.log(e));
}

function deleteFile(name) {
  containerClient.getBlobClient(name).deleteIfExists({ deleteSnapshots: 'include' })
    .then((resp) => console.log(resp))
    .catch((err) => console.log(err));
}

async function deleteAllSnapshots(name) {
  await containerClient.getBlobClient(name).deleteIfExists({ deleteSnapshots: 'only' });
}

(async () => {
  const snapshots = await getBlobSnapshots('C:/Users/kentl/Videos/hello.txt');
  downloadSnapshot('C:/Users/kentl/Videos/hello.txt', snapshots[0].snapshotTime);
})();

module.exports = {
  upload,
  getFileList,
  downloadFile,
  downloadSnapshot,
  deleteFile,
  deleteAllSnapshots,
};
