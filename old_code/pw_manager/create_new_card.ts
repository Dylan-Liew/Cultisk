import electron = require('electron')
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer

// Elements declaration
const CardNumberInput = document.getElementById("card-number-input") as HTMLInputElement
const CCVInput = document.getElementById("ccv-input") as HTMLInputElement
const ExpiryMonth = document.getElementById("expiry-month-input") as HTMLInputElement
const ExpiryYear = document.getElementById("expiry-year-input") as HTMLInputElement
const CreateEntryBtn = document.getElementById("create-entry-btn")

CreateEntryBtn.onclick = (): void => {
  const number = CardNumberInput.value
  const ccv = CCVInput.value
  // eslint-disable-next-line @typescript-eslint/camelcase
  const expiry_month = parseInt(ExpiryMonth.value)
  // eslint-disable-next-line @typescript-eslint/camelcase
  const expiry_year = parseInt(ExpiryYear.value)
  const EntryData: { number: string; expiry_month: number; ccv: string; expiry_year: number } = {
    number: number,
    ccv: ccv,
    // eslint-disable-next-line @typescript-eslint/camelcase
    expiry_month: expiry_month,
    // eslint-disable-next-line @typescript-eslint/camelcase
    expiry_year: expiry_year,
  }


  ipc.send("password_manager_entry", "create", "card", EntryData)
}