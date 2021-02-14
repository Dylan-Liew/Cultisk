import * as cron from 'cron';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { upload } from './azureAPI';
/*
Every 5 mins trigger backup
Every 30 mins trigger request OAuth
Every hour
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export function UploadLines(container: string) {
  async function inner() {
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
        await upload(line, container);
      } catch (err) {
        console.log(err);
      }
    }
    console.log('upload finished');
  }
  return inner;
}

export function createJob(container: string, interval = 60000) {
  return setInterval(UploadLines, interval, container);
}
