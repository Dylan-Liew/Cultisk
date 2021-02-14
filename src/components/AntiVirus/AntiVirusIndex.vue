<template>
  <div class="index">
      <div class="div-top-left">
          <b-form-file
          placeholder="Choose a folder (Default is the Downloads folder)"
          directory
          :file-name-formatter="formatNames"
        ></b-form-file>
      </div>
    <div class="card div-top-center" style="width: 5rem;">
      <div class="card-body m-2">
        <span class="font-weight-bold">last scanned time:</span> {{ last_scanned_time }}
      </div>
    </div>
      <div class="div-top-right">
        <div class="row">
          <div class="col text-center">
            <b-button style="width:130px; height: 45px; font-size:1.3em;" variant="primary" @click="RetrieveAVInfo(foldername)">Scan</b-button>
          </div>
        </div>
      </div>
      <md-table class="w-80 div-center shadow" v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title font-weight-bold">
              Anti-Virus Scan
            </h1>
          </div>
          <md-field md-clearable class="md-toolbar-secton-end">
            <md-input placeholder="Search by filename..." v-model="search" @input="searchOnTable" />
          </md-field>
        </md-table-toolbar>
          <md-table-empty-state class="div-empty" md-label="No results found" v-if="search!=null"
                                :md-description="`No software found for this '${search}' query. Try a different search term.`">
          </md-table-empty-state>
          <md-table-empty-state class="div-empty" md-label="Anti-Virus" v-else
                                :md-description="`Click the scan button to perform anti-virus scan. (All malicious files will be deleted automatically from the directory)`">
          </md-table-empty-state>
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Name" md-sort-by="name">{{ item.FilePath }}</md-table-cell>
          <md-table-cell md-label="Malicious" v-if="item.malicious"><span class="text-danger font-weight-bold">Malicious and Deleted</span></md-table-cell>
          <md-table-cell md-label="Malicious" v-else><span class="text-success font-weight-bold">Safe</span></md-table-cell>
        </md-table-row>
      </md-table>
    <div class="card single-v-1" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title text-muted m-2">Number of Files Scanned</h5>
        <p class="card-text">{{ FileScanned }}</p>
      </div>
    </div>
    <div class="card single-v-2" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title text-muted m-2">Number of Malicious Files</h5>
        <p class="card-text text-success" v-if="MalDetected===0">{{ MalDetected }}</p>
        <p class="card-text text-danger" v-else>{{ MalDetected }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .md-table {
    height: 550px;
    max-width: 70%;
    overflow-x: hidden; /* Hide horizontal scrollbar */
  }
  .div-center{
    position: fixed;
    top: 53%;
    left: 42%;
    transform: translate(-50%, -50%);
  }
  .div-empty{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .div-top-right{
    position: fixed;
    top: 6%;
    left: 88%;
    transform: translate(-50%, -50%);
  }
  .div-top-left{
    position: fixed;
    top: 6%;
    left: 26.5%;
    width: 500px;
    transform: translate(-50%, -50%);
  }
  .div-top-center{
    position: fixed;
    top: 6%;
    left: 63%;
    width: 330px !important;
    transform: translate(-50%, -50%);
  }
  .single-v-1{
    position: fixed;
    top: 30%;
    left: 88%;
    height: 200px !important;
    width: 200px !important;
    transform: translate(-50%, -50%);
  }
  .single-v-2{
    position: fixed;
    top: 70%;
    left: 88%;
    height: 200px !important;
    width: 200px !important;
    transform: translate(-50%, -50%);
  }
  .md-field {
    max-width: 300px;
  }
  .md-table-cell{
    max-width: 100px;
  }
  .w-80{
    width: 80%;
  }
  .card-title{
    font-size: 0.9em;
    text-align: left;
  }
  .card-text{
    font-size:4em;
    text-align: center;
    height: 140px;
    line-height: 140px;
  }
</style>

<script lang="ts">
/* eslint @typescript-eslint/no-var-requires: "off" */
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { AVInfo } from '@/types/custom.d';

const toLower = (text: string) => text.toString().toLowerCase();

const searchByName = (items: AVInfo[], term: string | null) => {
  if (term !== null) {
    return items.filter((item) => toLower(item.FilePath).includes(toLower(term)));
  }

  return items;
};

export default Vue.extend({
  name: 'AntiVirusIndex',
  data: () => ({
    search: null,
    searched: [],
    foldername: null,
  }),
  methods: {
    ...mapActions(['RetrieveAVInfo', 'ResetState']),
    searchOnTable() {
      this.searched = searchByName(this.ScannedList, this.search);
      console.log('searched after', this.searched);
    },
    formatNames(files) {
      try {
        const folder_name = files[0].path.substring(0, files[0].path.lastIndexOf('\\'));
        this.foldername = folder_name;
        return `${folder_name} folder selected`;
      } catch (err) {
        return 'Invalid folder selected';
      }
    },
  },
  computed: mapGetters(['ScannedList', 'MalDetected', 'FileScanned', 'last_scanned_time']),
  watch: {
    ScannedList(newValue) {
      this.searched = newValue;
    },
  },
  beforeRouteLeave(to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    this.ResetState();
    next();
  },
});
</script>
