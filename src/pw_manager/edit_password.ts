import electron = require('electron')
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer

// Elements declaration
const UsernameInput = document.getElementById("username-input") as HTMLInputElement
const PasswordInput = document.getElementById("password-input") as HTMLInputElement
const TOTPInput = document.getElementById("totp-input") as HTMLInputElement
const URLInput = document.getElementById("url-input") as HTMLInputElement
const EditEntryBtn = document.getElementById("edit-entry-btn")

// ID declaration
let EntryID: number = null;

// On data receive
ipc.on("password_manager_data", (event, data: PasswordObj) => {
  EntryID = data.id
  UsernameInput.value = data.username
  PasswordInput.value = data.password
  if (data.totp_secret != undefined) {
    TOTPInput.value = data.totp_secret
  } else if (data.url != undefined) {
    URLInput.value = data.url
  }
})

EditEntryBtn.onclick = (): void => {
  const password = PasswordInput.value
  const username = UsernameInput.value
  const TOTPSecret = TOTPInput.value
  const URL = URLInput.value
  const EntryData: { id: number; password: string; username: string; totp_secret?: string; url?: string } = {
    id: EntryID,
    username: username,
    password: password,
  }
  if (TOTPSecret != "") {
    // eslint-disable-next-line @typescript-eslint/camelcase
    EntryData.totp_secret = TOTPSecret
  } else if (URL != "") {
    EntryData.url = URL
  }

  ipc.send("password_manager_entry", "edit", "password", EntryData)
}