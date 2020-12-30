import electron = require('electron');
const dialog = electron.remote.dialog
// Elements declaration


electron.ipcRenderer.on("password-manager-decrypt-ok", (event, res) => {
    console.log(res)
})