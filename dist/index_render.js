const electron = require('electron');
const path = require('path');
const zerorpc = require("zerorpc");
const BrowserWindow = electron.remote.BrowserWindow;
const PasswordManagerBtn = document.getElementById("pw-manager-btn");
const client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");
PasswordManagerBtn.onclick = () => {
    let win = new BrowserWindow({ width: 800, height: 600 });
    win.on("close", function () { win = null; });
    win.loadURL(path.join(__dirname, "../src/pw_manager.html")).then(() => {
        win.show();
    });
};
const RPCTestBtn = document.getElementById("test-rpc-btn");
const RPCOutput = document.getElementById("output");
RPCTestBtn.onclick = () => {
    client.invoke("hello", "RPC", (error, res, more) => {
        RPCOutput.innerText = res;
    });
};
//# sourceMappingURL=index_render.js.map