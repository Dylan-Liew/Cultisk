import electron = require('electron')
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer

// Elements declaration
const ContentInput = document.getElementById("note-content") as HTMLTextAreaElement
const EditEntryBtn = document.getElementById("create-entry-btn")

// ID declaration
let EntryID: number = null;

// On data receive
ipc.on("password_manager_data", (event, data: CardObj) => {
  EntryID = data.id
  ContentInput.value = data.number
})

EditEntryBtn.onclick = (): void => {
  const content = ContentInput.value
  const EntryData: { id: number; content: string } = {
    id: EntryID,
    content: content,
  }
  ipc.send("password_manager_entry", "edit", "note", EntryData)
}