import { app, BrowserWindow, ipcMain, dialog} from 'electron';
import * as path from 'path'
const zerorpc = require("zerorpc")


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../src/index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Init ZeroRPC client
const client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");
client.on("error", function(error: string) {
    console.error("RPC client error:", error);
});

// Typescript definitions
interface RPCResponse {
    success: boolean;
    error_code?: string;
    error_message?: string;
}

//Password Manager
ipcMain.on("password-manager-launched", () => {
  client.invoke("password_manager_start", (error: string, res: string) => {
      const ResObj: RPCResponse = JSON.parse(res)
      let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {enableRemoteModule: true, nodeIntegration:true}
      })
      win.on("close", () => { win = null })
      if (!ResObj.success && ResObj.error_code == "DB_MISSING") {
          const DiaOptions = {
              type: "info",
              title: "Database file not found",
              message: "We couldn't find a existing database file, a new one will be created."
          }
          dialog.showMessageBox(DiaOptions).then(()=>{
              win.loadURL(path.join(__dirname, "../src/pw_manager/new_master_password.html")).then(()=>{
                  win.show()
                  // On password enter, create DB
                  ipcMain.on("set-master-password", (event, arg) => {
                      client.invoke("password_manager_create_db", arg, (error: string, res: string) => {
                          const ResObj = JSON.parse(res)
                          if (ResObj.success) {
                              win.loadURL(path.join(__dirname, "../src/pw_manager/main.html"))
                          }
                      })
                  })
              })
          })
      } else if (ResObj.success) {
          win.loadURL(path.join(__dirname, "../src/pw_manager/enter_password.html")).then(()=>{
              win.show()
              // On password enter, decrypt DB
              ipcMain.on("password-manager-decrypt", (event, MasterPassword) => {
                client.invoke("password_manager_main", MasterPassword, (error: string, res: string) => {
                    const ResObj = JSON.parse(res)
                    console.log(ResObj)
                    if (ResObj.success) {
                        win.loadURL(path.join(__dirname, "../src/pw_manager/main.html"))
                        event.reply("password-manager-decrypt-ok", ResObj)
                    } else {
                        event.reply("password-manager-decrypt-failed", ResObj)
                    }
                })
              })
          })
      }
  })
})