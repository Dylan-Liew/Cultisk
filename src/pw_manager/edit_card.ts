import electron = require('electron')
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer

// Elements declaration
const CardNumberInput = document.getElementById("card-number-input") as HTMLInputElement
const CCVInput = document.getElementById("ccv-input") as HTMLInputElement
const ExpiryMonth = document.getElementById("expiry-month-input") as HTMLInputElement
const ExpiryYear = document.getElementById("expiry-year-input") as HTMLInputElement
const EditEntryBtn = document.getElementById("create-entry-btn")

// ID declaration
let EntryID: number = null;


// On data receive
ipc.on("password_manager_data", (event, data: CardObj) => {
  EntryID = data.id
  CardNumberInput.value = data.number
  CCVInput.value = data.ccv
  ExpiryYear.value = String(data.expiry_year)
  ExpiryMonth.value = String(data.expiry_month)
})

EditEntryBtn.onclick = (): void => {
  const number = CardNumberInput.value
  const ccv = CCVInput.value
  // eslint-disable-next-line @typescript-eslint/camelcase
  const expiry_month = ExpiryMonth.value
  // eslint-disable-next-line @typescript-eslint/camelcase
  const expiry_year = ExpiryYear.value
  const EntryData: { number: string; expiry_month: number; ccv: string; id: number; expiry_year: number } = {
    id: EntryID,
    number: number,
    ccv: ccv,
    // eslint-disable-next-line @typescript-eslint/camelcase
    expiry_month: parseInt(expiry_month),
    // eslint-disable-next-line @typescript-eslint/camelcase
    expiry_year: parseInt(expiry_year),
  }

  ipc.send("password_manager_entry", "edit", "card", EntryData)
}