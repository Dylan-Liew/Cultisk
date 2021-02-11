<template>
  <div class="index">
      <md-table class="w-80 div-center" v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title font-weight-bold">Software Update Scan</h1>
          </div>
          <md-field md-clearable class="md-toolbar-secton-end">
            <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
          </md-field>
          </md-table-toolbar>
          <md-table-empty-state class="div-empty" md-label="No results found" v-if="search!=null"
                                :md-description="`No software found for this '${search}' query. Try a different search term.`">
          </md-table-empty-state>
          <md-table-empty-state class="div-empty" md-label="Scan for Software Updates" v-else
                                :md-description="`Click the scan button below to check for software updates`">
          </md-table-empty-state>
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
            <md-table-cell md-label="Version">{{ item.version }}</md-table-cell>
            <md-table-cell md-label="Publisher" md-sort-by="publisher">{{ item.publisher }}</md-table-cell>
            <md-table-cell md-label="Latest Version">{{ item.lat_version }}</md-table-cell>
            <md-table-cell md-label="Download Link"><md-button class="md-primary md-raised">Download</md-button></md-table-cell>
<!--              {{ item.download_link }}-->
          </md-table-row>
        </md-table>
        <div class="div-bottom container">
          <div class="row">
            <div class="col text-center">
              <b-button style="width:130px; height: 45px; font-size:1.3em;" variant="primary" @click="RetrieveSoftwareInfo">Scan</b-button>
            </div>
          </div>
        </div>
  </div>
</template>

<style scoped>
  .md-table{
    height: 550px;
    max-width: 80%;
  }
  .div-center{
    position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
    .div-empty{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .div-bottom{
    position: fixed;
    top: 93%;
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
import { mapGetters, mapActions } from 'vuex';
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
