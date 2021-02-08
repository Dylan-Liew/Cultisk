import ErrnoException = NodeJS.ErrnoException;

const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

function addFilePath(name: string) {
  const filePath = `${path.normalize(name)}\n`;
  fs.writeFile(path.join(__dirname, 'pathList.txt'), Buffer.from(filePath), { flag: 'a' }, (err: ErrnoException) => console.log(err));
}

module.exports = {
  addFilePath,
};
