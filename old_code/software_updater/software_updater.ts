import electron = require('electron')
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer

// Elements declaration
const SoftwareTable = document.querySelector("div#software-list > table")
const SoftwareBtn = document.getElementById("get-software-btn")

// on data received
ipc.on("software-updater-data", (event, data) => {
  for (const software of data) {
    const tr = document.createElement("tr")
    const keys = Object.keys(software)
    for (const key of keys) {
      const td = document.createElement("td")
      td.innerHTML = software[key]
      tr.append(td)
    }
  SoftwareTable.append(tr)
  }
})

// on click send request for data
SoftwareBtn.onclick = (): void => {
  ipc.send("software-updater-get-software")
}