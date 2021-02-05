import { CronJob } from 'cron';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { upload } from './azureAPI';
/*
Every 5 mins trigger backup
Every 30 mins trigger request OAuth
Every hour
 */

const BackupJob = new CronJob('0 */1 * * * *', async () => {
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
}, null, true, 'Asia/Singapore');

const AuthJob = new CronJob('0 */30 * * * *', (() => {
  console.log('Auth Request', Date().toLocaleLowerCase());
}), null, true, 'Asia/Singapore');

export function getNextBackupDate() {
  return BackupJob.nextDates(5);
}
