import electron = require('electron')
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer

// Elements declaration
const PasswordInput = document.getElementById("password-input") as HTMLInputElement
const PasswordConfirmInput = document.getElementById("password-confirm-input") as HTMLInputElement
const SubmitPasswordBtn = document.getElementById("submit-password-btn")

SubmitPasswordBtn.onclick = (): void => {
  const MasterPassword = PasswordInput.value
  const MasterPasswordConfirm = PasswordConfirmInput.value
  if (MasterPassword === MasterPasswordConfirm) {
    ipc.send("set-master-password", MasterPassword)
  } else {
    dialog.showErrorBox("Password doesn't match", "The Master password don't match, please enter again.")
    PasswordConfirmInput.value = ""
    PasswordInput.value = ""
  }
}