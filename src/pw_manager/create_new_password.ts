import electron = require('electron')
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer

// Elements declaration
const UsernameInput = document.getElementById("username-input") as HTMLInputElement
const PasswordInput = document.getElementById("password-input") as HTMLInputElement
const TOTPInput = document.getElementById("totp-input") as HTMLInputElement
const URLInput = document.getElementById("url-input") as HTMLInputElement
const CreateEntryBtn = document.getElementById("create-entry-btn")

CreateEntryBtn.onclick = (): void => {
  const password = PasswordInput.value
  const username = UsernameInput.value
  const TOTPSecret = TOTPInput.value
  const URL = URLInput.value
  const EntryData: { password: string; username: string; totp_secret?: string; url?: string } = {
    username: username,
    password: password,
  }
  if (TOTPSecret != "") {
    // eslint-disable-next-line @typescript-eslint/camelcase
    EntryData.totp_secret = TOTPSecret
  } else if (URL != "") {
    EntryData.url = URL
  }

  ipc.send("password_manager_create_new_entry", "create", "password", EntryData)
}