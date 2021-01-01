import electron = require('electron')
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer

// Elements declaration
const PasswordInput = document.getElementById("password-input") as HTMLInputElement
const SubmitPasswordBtn = document.getElementById("submit-password-btn")

SubmitPasswordBtn.onclick = (): void => {
  const MasterPassword = PasswordInput.value
  ipc.send("password-manager-decrypt", MasterPassword)
  ipc.on("password-manager-decrypt-failed", (event, res) => {
    dialog.showErrorBox("Unable to decrypt database", res.error_message)
    PasswordInput.value = ""
  })
}