import * as StorageBlob from '@azure/storage-blob';
import * as BlobChangefeed from '@azure/storage-blob-changefeed';
import * as fs from 'fs';
import { promises as fsp } from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import * as crypto from 'crypto';
import _ from 'lodash';
import { match } from 'assert';

const connectStr = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const blobServiceClient = StorageBlob.BlobServiceClient.fromConnectionString(connectStr);
const containerClient = blobServiceClient.getContainerClient('test');

function md5File(filePath: string) {
  return new Promise((resolve, reject) => {
    const output = crypto.createHash('md5');
    const input = fs.createReadStream(filePath);

    input.on('error', (err) => {
      reject(err);
    });

    output.once('readable', () => {
      resolve(output.read().toString('hex'));
    });

    input.pipe(output);
  });
}

async function walk(dir: string) {
  let files = [];
  files = await fsp.readdir(dir);
  files = await Promise.all(files.map(async (file: string): Promise<any> => {
    const filePath = path.join(dir, file);
    const stats = await fsp.stat(filePath);
    if (stats.isDirectory()) return walk(filePath);
    return filePath;
  }));

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

export async function upload(filePath: string) {
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
      const cloudMd5: Buffer = Buffer.from(cloudProperties.contentMD5!);
      const cloudHash = cloudMd5.toString('hex');
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

export async function getFileJSON(folder = '') {
  let fileJSON = {};
  function parse(matches: Array<string>) {
    const temp: {[key: string]: {}} = {};
    if (matches.length === 1) {
      temp[matches[0]] = {};
      return temp;
    }
    const parent = matches[0];
    temp[parent] = temp[parent] || {};
    temp[parent] = parse(matches.slice(1));
    console.log(temp);
    return temp;
  }
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of blobServiceClient.getContainerClient('test').listBlobsFlat()) {
    const reg = /[^\/]+/g;
    const matches = item.name.match(reg)!;
    fileJSON = _.merge(fileJSON, parse(matches));
  }
  return fileJSON;
}

export async function getFileList(folder = '') {
  const fileList = [];
  for await (const item of blobServiceClient.getContainerClient('test').listBlobsFlat()) {
    const reg = /[^\/]+/g;
    const matches = item.name.match(reg)!;
    fileList.push({ name: matches.pop(), path: item.name });
  }
  console.log(fileList);
  return fileList;
}

export async function getBlobSnapshots(name: string) {
  const snapList = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const value of blobServiceClient.getContainerClient('test').listBlobsFlat({ prefix: name, includeSnapshots: true })) {
    if (value.snapshot) {
      snapList.push({ lastModified: value.properties.lastModified, snapshotTime: value.snapshot });
    }
  }
  return snapList;
}

export function downloadFile(name: string) {
  try {
    containerClient.getBlobClient(name).download()
      .then(
        (resp: StorageBlob.BlobDownloadResponseParsed) => {
          const filePath = resp.metadata!.path;
          const writeStream: fs.WriteStream = fs.createWriteStream(filePath);
          const readStream = resp.readableStreamBody!;
          stream.pipeline(readStream, writeStream,
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
  } catch (err) {
    console.log(err);
  }
}

export async function downloadSnapshot(name: string, snapshot: string) {
  containerClient.getBlobClient(name).withSnapshot(snapshot).download()
    .then(
      (resp) => {
        console.log(fs.statSync(name));
        (async () => {
          await fsp.writeFile(name + snapshot.replace(/[^a-zA-Z0-9]/g, ''), Buffer.from(''), { flag: 'w' });
        })();
        const writeStream = fs.createWriteStream(name + snapshot.replace(/[^a-zA-Z0-9]/g, ''), { flags: 'w', mode: 0o666 });
        const readStream = resp.readableStreamBody!;
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

export function deleteFile(name: string) {
  containerClient.getBlobClient(name).deleteIfExists({ deleteSnapshots: 'include' })
    .then((resp) => console.log(resp))
    .catch((err) => console.log(err));
}

export async function deleteAllSnapshots(name: string) {
  await containerClient.getBlobClient(name).deleteIfExists({ deleteSnapshots: 'only' });
}
