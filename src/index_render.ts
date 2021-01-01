import electron = require('electron')

const zerorpc = require("zerorpc")
const ipc = electron.ipcRenderer

// HTML element declaration
const PasswordManagerBtn = document.getElementById("pw-manager-btn")

// Init ZeroRPC client
const client = new zerorpc.Client({heartbeatInterval:30000, timeout: 30});
client.connect("tcp://127.0.0.1:4242");
client.on("error", function (error: string) {
  console.error("RPC client error:", error);
});

// Password Manager Launch
PasswordManagerBtn.onclick = (): void => {
  ipc.send("password-manager-launched")
}

const RPCTestBtn = document.getElementById("test-rpc-btn")
const RPCOutput = document.getElementById("output")

RPCTestBtn.onclick = (): void => {
  client.invoke("start", [], (error: string, res: string, more: never) => {
    const ResObj = JSON.parse(res)
  });
}