<template>
  <div class="index">
      <div class="div-top w-80">
          <div class="float-left">
            <b-card style="width:400px">
              <div class="text-dark">
                Number of Software : {{ searched.length }}
              </div>
            </b-card>
          </div>
          <div class="float-right" >
                <b-button variant="primary shadow " @click="RetrieveSoftwareInfo">Scan</b-button>
          </div>
      </div>
      <md-table class="w-80 div-center shadow" v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title">Software Update Scan</h1>
          </div>
          <md-field md-clearable class="md-toolbar-secton-end">
            <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
          </md-field>
          </md-table-toolbar>
          <md-table-empty-state>
          </md-table-empty-state>
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
            <md-table-cell md-label="Version" md-sort-by="version">{{ item.version }}</md-table-cell>
            <md-table-cell md-label="Publisher" md-sort-by="publisher">{{ item.publisher }}</md-table-cell>
            <md-table-cell md-label="Latest Version" md-sort-by="lat_version">{{ item.lat_version }}</md-table-cell>
            <md-table-cell md-label="Download Link" md-sort-by="download_link">{{ item.download_link }}</md-table-cell>
          </md-table-row>
        </md-table>
  </div>
</template>

<style scoped>
  .md-table {
    height: 550px;
    max-width: 80%;
  }
  .div-center{
    position: fixed;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .div-top{
    position: fixed;
    top: 6%;
    left: 50%;
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
</style>

<script lang="ts">
/* eslint @typescript-eslint/no-var-requires: "off" */
import Vue from 'vue';
import { mapGetters, mapActions, mapState } from 'vuex';
import { SoftwareInfo } from '@/types/custom.d';

const toLower = (text: string) => text.toString().toLowerCase();

const searchByName = (items: SoftwareInfo[], term: string | null) => {
  if (term !== null) {
    return items.filter((item) => toLower(item.name).includes(toLower(term)));
  }

  return items;
};

export default Vue.extend({
  name: 'SoftwareIndex',
  data: () => ({
    search: null,
    searched: [],
  }),
  methods: {
    ...mapActions(['RetrieveSoftwareInfo']),
    searchOnTable() {
      this.searched = searchByName(this.allSoftware, this.search);
      console.log('searched after', this.searched);
    },
  },
  computed: mapGetters(['allSoftware']),
  watch: {
    allSoftware(newValue) {
      this.searched = newValue;
    },
  },
});
</script>
