<template>
  <div class="anti-virus">
    <Index/>
    <body>
    <p>Directory: C:\\Users\\IEUser\\Downloads\\controlled_test</p>
    <label for="directory-input">Directory</label><input id="directory-input">
    <br>
    <p>Detected Malware</p>
    <p>{{ MalwareDetected }}</p>
    <br>
    <p>Number of files scan</p>
    <p>{{ filesScanned }}</p>
    <br>
    <p>File Scan list</p>
    <p>{{ scanlist }}</p>
    <br>
    <button v-on:click="scan">Scan</button>
    </body>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Index from '@/components/AntiVirus/AntiVirusIndex.vue'; // @ is an alias to /src
/*
import electron = require('electron')
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer
*/
export default Vue.extend({
  name: 'AntiVirus',
  components: {
    Index,
  },
});

/*
// Elements declaration
const DirectoryInput = document.getElementById("directory-input") as HTMLInputElement
const ScanBtn = document.getElementById("scan-file")
const DetectMalware = document.getElementById("detected_malware") as HTMLInputElement
const FileScanned = document.getElementById("files_scanned") as HTMLInputElement
const ScanList = document.getElementById("scan_list")

ScanBtn.onclick = (): void => {
    const directory = DirectoryInput.value
    ipc.send("Anti-virus-scan", directory)
}

ipc.on("av_result", (event, data: ScanResultObj) => {
    DetectMalware.value = String(data.mal_detected)
    FileScanned.value = String(data.files_scanned)
    ScanList.innerText = data.scanned_list
})
*/

// Anti virus

// client.invoke(("scan"), (error: string, res: string) => {
//     const ResObj: ScanResultObj = JSON.parse(res)
//     event.reply("av_result", ResObj)
// })

</script>

<style scoped>

</style>
