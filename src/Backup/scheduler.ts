const { CronJob } = require("cron");
const { upload } = require("./azureAPI.ts");
const fs = require("fs");
const readline = require("readline");
const path = require("path");
/*
Every 5 mins trigger backup
Every 30 mins trigger request OAuth
Every hour 
 */

var BackupJob = new CronJob('0 */1 * * * *', async () => {
    console.log("starting upload");
    const fileStream = fs.createReadStream(path.join(__dirname, "pathList.txt"));

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
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
    console.log("upload finished");
}, null, true, 'Asia/Singapore');

var AuthJob = new CronJob('0 */30 * * * *', function () {
	console.log('Auth Request', Date().toLocaleLowerCase());
}, null, true, 'Asia/Singapore');

function getNextBackupDate() {
    return BackupJob.nextDates();
}

module.exports = {
    getNextBackupDate
}