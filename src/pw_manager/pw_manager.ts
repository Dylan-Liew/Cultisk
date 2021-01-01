import electron = require('electron')
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer

// Elements declaration
const EditPWEntry = document.getElementById("edit-password-entry-btn")
const EditNoteEntry = document.getElementById("edit-note-entry-btn")
const EditCardEntry = document.getElementById("edit-card-entry-btn")
const TestDataOutput = document.getElementById("test-data-output")

ipc.on("password_manager_data", (event, data) => {
  TestDataOutput.innerText = JSON.stringify(data)
})

// Static Modify Entry with ID 1
EditPWEntry.onclick = (): void => {
  ipc.send("password_manager_edit_switch", "password", 1)
}

EditNoteEntry.onclick = (): void => {
  ipc.send("password_manager_edit_switch", "note", 1)
}

EditCardEntry.onclick = (): void => {
  ipc.send("password_manager_edit_switch", "card", 1)
}