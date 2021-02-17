<template>
  <div class="backup-index">
    <b-container class="position-fixed">
      <b-row>
        <b-col cols="6" >
            <md-table class="backup mt-2" md-height="100%" style="height:80%" v-model="files" md-card @md-selected="onSelect" md-fixed-header>
              <md-table-toolbar class="mb-3">
                <div class="md-toolbar-row">
                  <h1 class="md-title">Backup Files</h1>
                </div>
                <div class="md-toolbar-section-start">
                  <div class="text-center">
                      <b-button variant="primary" v-b-modal.modal-prevent-closing>Upload File</b-button>
                  </div>
                </div>
                <div class="md-toolbar-section-end">
                  <div class="text-center">
                      <b-button variant="primary w-100" v-b-modal.modal-prevent-closing2>Settings</b-button>
                  </div>
                </div>
              </md-table-toolbar>
            <md-table-row class="content" slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
              <md-table-cell md-label="Backup Manager" md-sort-by="id">
                  <span class="font-weight-bold">{{item.filename}}</span>
                  <button class="download btn float-right mb-2"><i class="fa fa-download"></i></button>
                  <br>
                  {{item.username}}
              </md-table-cell>
            </md-table-row>
          </md-table>
        </b-col>
        <b-col cols="6">
          <md-table class="details mt-4" style="width:600px;" v-model="selected.Snapshots" md-sort="Filename" md-sort-order="asc" md-card>
            <md-table-toolbar>
              <h1 class="md-title">File Snapshots</h1>
            </md-table-toolbar>
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Filename" md-sort-by="Filename">{{ item.Filename }}</md-table-cell>
              <md-table-cell md-label="Last Modified">{{ item.LastModifiedTime }}</md-table-cell>
              <md-table-cell md-label="Download" md-sort-by="download_link"><md-button class="md-primary md-raised">Download</md-button></md-table-cell>
            </md-table-row>
          </md-table>
        </b-col>
      </b-row>
    </b-container>
   <b-modal
        id="modal-prevent-closing"
        ref="modal"
        title="Upload File"
        @ok="x"
      >
     <b-form-file
        v-model="file1"
        :state="Boolean(file1)"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      ></b-form-file>
    </b-modal>
 <b-modal
  id="modal-prevent-closing2"
  ref="modal"
  title="Settings"
  @ok="x"
  >
    <b-form-file
      placeholder="Autobackup Folder"
      directory
      :file-name-formatter="formatNames"
    ></b-form-file>
      <b-form-select
        id="inline-form-custom-select-pref"
        class="mb-2 mr-sm-2 mb-sm-0 mt-3"
        :options="[{ text: 'Choose...', value: null }, 'Every 5 minute', 'Every 15 minute', 'Every 30 minute', 'Every 1 hour']"
        :value="null"
      ></b-form-select>
    </b-modal>
  </div>

</template>

<style>
.backup-index .md-table-fixed-header{
  display: none !important;
}
.backup-index  .backup{
  width: 70%;
  margin: auto;
}
.backup-index button:focus{
  outline: none;
  box-shadow: none;
}
.backup-index .download {
  background-color: Black;
  border: none;
  color: white;
  padding: 6px 8px;
  font-size: 16px;
  cursor: pointer;
}

/* Darker background on mouse-over */
.backup-index  .download:hover {
  background-color: white;
  color: black;
}
.backup-index  .details{
  overflow-x: hidden; /* Hide horizontal scrollbar */
}
</style>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'BackupToolIndex',
  data: () => ({
    selected: {},
    foldername: null,
    files: [],
  }),
  methods: {
    getClass: ({ filename }) => ({
      'md-primary': filename,
    }),
    onSelect(item) {
      this.selected = item;
    },
    formatNames(files) {
      try {
        const folder_name = files[0].path.substring(0, files[0].path.lastIndexOf('\\'));
        this.foldername = folder_name;
        return `${folder_name}`;
      } catch (err) {
        return 'Invalid folder selected';
      }
    },
    ...mapActions(['AddPath', 'GetFileList']),
  },
  created() {
    this.data().files = this.GetFileList();
  },
});
</script>
