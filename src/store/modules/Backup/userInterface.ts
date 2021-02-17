import readline from 'readline';
import { upload } from '@/store/modules/Backup/azureAPI';
import * as path from 'path';
import * as ofs from 'original-fs';
import { remote } from 'electron';

const { app } = remote;
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export function addFilePath(name: string) {
  const filePath = `${path.normalize(name)}\n`;
  ofs.writeFile(path.join(app.getAppPath(), 'pathList.txt'), Buffer.from(filePath), { flag: 'a' }, (err: any) => console.log(err));
}

export async function getFilePaths() {
  const fileStream = ofs.createReadStream(path.join(__dirname, 'pathList.txt'));

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
  const pathArray: string[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    try {
      pathArray.push(line);
    } catch (err) {
      console.log(err);
    }
  }
  return pathArray;
}

module.exports = {
  addFilePath,
  getFilePaths,
};
