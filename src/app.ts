import {app, BrowserWindow, dialog, ipcMain} from 'electron'
import * as path from 'path'

const zerorpc = require("zerorpc")


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
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
  mainWindow.loadFile(path.join(__dirname, '../src/index.html')).then(()=> {
    mainWindow.show()
    mainWindow.webContents.openDevTools()
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});

// Init ZeroRPC client
const client = new zerorpc.Client()
client.connect("tcp://127.0.0.1:4242")
client.on("error", function(error: string) {
  console.error("RPC client error:", error)
});

// Typescript definitions stored at /src/types/custom.d.ts
// Declare globals, specify types at /src/types/custom.d.ts
global.LastPasswordManagerData = {"notes": [], "passwords": [], "cards": []}

// Helper functions
function RetrieveEntryByID(EntryType: string, id: number): PasswordObj|NoteObj|CardObj {
  const data = global.LastPasswordManagerData[`${EntryType}s`]
  return data.find((obj: { id: number }) => {
    return obj.id === id
  })
}

//Password Manager
ipcMain.on("password-manager-launched", () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {enableRemoteModule: true, nodeIntegration:true}
  })
  client.invoke("password_manager_start", (error: string, res: string) => {
    const ResObj: RPCResponse = JSON.parse(res)
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
          ipcMain.on("set-master-password", (event, arg: string) => {
            client.invoke("password_manager_create_db", arg, (error: string, res: string) => {
              const ResObj: RPCResponse = JSON.parse(res)
              if (ResObj.success) {
                win.loadURL(path.join(__dirname, "../src/pw_manager/main.html")).then(() => {
                  event.reply("password_manager_data", global.LastPasswordManagerData)
                })
              }
            })
          })
        })
      })
    } else if (ResObj.success) {
      win.loadURL(path.join(__dirname, "../src/pw_manager/enter_password.html")).then(()=>{
        win.show()
        // On password enter, decrypt DB
        ipcMain.on("password-manager-decrypt", (event, MasterPassword: string) => {
          client.invoke("password_manager_main", MasterPassword, (error: string, res: string) => {
            const ResObj: RPCResponse = JSON.parse(res)
            console.log(ResObj)
            if (ResObj.success) {
              win.loadURL(path.join(__dirname, "../src/pw_manager/main.html")).then(()=> {
                event.reply("password_manager_data", ResObj.data)
                global.LastPasswordManagerData = ResObj.data as PasswordManagerData
              })
            } else {
              event.reply("password-manager-decrypt-failed", ResObj)
            }
          })
        })
      })
    }
  })
  ipcMain.on("password_manager_edit_switch", (event, EntryType: string, id: number) => {
    win.loadURL(path.join(__dirname, `../src/pw_manager/edit_${EntryType}.html`)).then(() => {
      const data = RetrieveEntryByID(EntryType, id)
      event.reply("password_manager_data", data)
    })
  })
  ipcMain.on("password_manager_entry", (event,action: string, EntryType: string, data: PasswordObj | NoteObj | CardObj) => {
    const JsonData = JSON.stringify(data)
    client.invoke(`${action}_${EntryType}_entry`, JsonData, (error: string, res: string) => {
      const ResObj: RPCResponse = JSON.parse(res)
      const CurrentData = global.LastPasswordManagerData
      const CurrentArray = CurrentData[`${EntryType}s`]
      if (ResObj.success && !ResObj.deleted) {
        const ExistingEntry = RetrieveEntryByID(EntryType, ResObj.data.id)
        if (ExistingEntry == undefined){
          CurrentArray.push(ResObj.data)
          CurrentData[`${EntryType}s`] = CurrentArray
        } else {
          const MergingArray = [ResObj.data]
          CurrentData[`${EntryType}s`] = CurrentArray.map((obj: { id: number }) => MergingArray.find(o => o.id === obj.id) || obj)
        }
      } else if (ResObj.success && ResObj.deleted) {
          CurrentData[`${EntryType}s`] = CurrentArray.filter((obj: { id: number }) => obj.id != data.id)
      } else {
        console.log(ResObj)
      }
      if (ResObj.success) {
        global.LastPasswordManagerData = CurrentData
        win.loadURL(path.join(__dirname, "../src/pw_manager/main.html")).then(() => {
            event.reply("password_manager_data", global.LastPasswordManagerData)
            console.log(ResObj)
        })
      }
    })
  })
})