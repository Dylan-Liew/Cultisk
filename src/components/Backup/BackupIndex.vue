<template>
  <div class="backup-index">
    <b-container class="position-fixed">
      <b-row>
        <b-col cols="6" >
            <md-table class="p-entries mt-2" md-height="590px" style="height:650px" v-model="files" md-card @md-selected="onSelect" md-fixed-header>
            <md-table-row class="content" slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
              <md-table-cell md-label="Backup Manager" md-sort-by="id">
                  <span class="font-weight-bold">{{item.filename}}</span>
                  <button class="btn float-right mb-2"><i class="fa fa-download"></i></button>
                  <br>
                  {{item.username}}
              </md-table-cell>
            </md-table-row>
          </md-table>
        </b-col>
        <b-col cols="6">
          <md-table v-model="selected.Snapshots" md-sort="Filename" md-sort-order="asc" md-card>
            <md-table-toolbar>
              <h1 class="md-title">File Snapshots</h1>
            </md-table-toolbar>
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Filename" md-sort-by="Filename">{{ item.Filename }}</md-table-cell>
              <md-table-cell md-label="Last">{{ item.LastModifiedTime }}</md-table-cell>
              <md-table-cell md-label="Download" md-sort-by="download_link"><md-button class="md-primary md-raised">Download</md-button></md-table-cell>
            </md-table-row>
          </md-table>
        </b-col>
      </b-row>
    </b-container>

  </div>

</template>

<style scoped>
.p-entries{
  width: 70%;
  margin: auto;
}
button:focus{
  outline: none;
  box-shadow: none;
}
.btn {
  background-color: Black;
  border: none;
  color: white;
  padding: 6px 8px;
  font-size: 16px;
  cursor: pointer;
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: white;
  color: black;
}
</style>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'BackupToolIndex',
  data: () => ({
    selected: {},
    files: [
      {
        filename: 'C:/Users/kentl/Videos/hello.txt',
        LastModifiedTime: '2/2/2021, 6:29:02 PM',
        Snapshots: [{ Filename: 'C:/Users/kentl/Videos/hello.txt', LastModifiedTime: '2/2/2021, 5:35:02 PM' }, { Filename: 'C:/Users/kentl/Videos/hello.txt', LastModifiedTime: '2/2/2021, 5:35:02 PM' }],
      },
      {
        filename: 'C:/Users/kentl/Videos/hello2.txt',
        LastModifiedTime: '2/2/2021, 6:05:02 PM',
        Snapshots: [{ Filename: 'C:/Users/kentl/Videos/hello2.txt', LastModifiedTime: '2/2/2021, 3:40:05 PM' }],
      },
      {
        filename: 'test/test.txt',
        LastModifiedTime: '2020-01-12',
        Snapshots: [{ Filename: '1231223.txt', LastModifiedTime: '123123.txt' }],
      },
      {
        filename: 'test/test.txt',
        LastModifiedTime: '2020-01-12',
        Snapshots: [{ Filename: '1231223.txt', LastModifiedTime: '123123.txt' }],
      },
    ],
  }),
  methods: {
    getClass: ({ filename }) => ({
      'md-primary': filename,
    }),
    onSelect(item) {
      this.selected = item;
    },
  },
});
</script>
