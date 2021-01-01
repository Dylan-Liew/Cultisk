import electron = require('electron')
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer

// Elements declaration
const ContentInput = document.getElementById("note-content") as HTMLTextAreaElement
const CreateEntryBtn = document.getElementById("create-entry-btn")

CreateEntryBtn.onclick = (): void => {
  const content = ContentInput.value
  const EntryData: { content: string } = {
    content: content,
  }
  ipc.send("password_manager_create_new_entry", "create", "note", EntryData)
}