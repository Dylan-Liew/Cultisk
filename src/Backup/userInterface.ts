const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

function addFilePath(name) {
  const filePath = `${path.normalize(name)}\n`;
  fs.writeFile(path.join(__dirname, 'pathList.txt'), Buffer.from(filePath), { flag: 'a' }, (err) => console.log(err));
}

module.exports = {
  addFilePath,
};
