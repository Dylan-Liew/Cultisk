<template>
  <div>
    <md-table v-model="searched" md-sort="deleted_time" md-sort-order="asc" md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title font-weight-bold">Deleted Files</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search by filename..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state class="div-empty" v-if="search"
        md-label="No files found"
        :md-description="`No files found for this '${search}' query. Try a different search term.`">
      </md-table-empty-state>

      <md-table-empty-state class="div-empty" v-else/>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="File Name" md-sort-by="filename">{{ item.FilePath }}</md-table-cell>
        <md-table-cell md-label="Deleted Time" md-sort-by="deleted_time">{{ item.timing }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<style scoped>
  .md-table{
    height: 600px;
    width: 1000px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .md-field {
    max-width: 300px;
  }
  .div-empty{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

const toLower = (text) => text.toString().toLowerCase();

const searchByName = (items, term) => {
  if (term) {
    return items.filter((item) => toLower(item.filename).includes(toLower(term)));
  }

  return items;
};

export default Vue.extend({
  name: 'DeletedFiles',
  data: () => ({
    search: null,
    searched: [],
  }),
  computed: mapGetters(['deletedFiles']),
  methods: {
    ...mapActions(['GetDeletedFiles']),
    searchOnTable() {
      this.searched = searchByName(this.deletedFiles, this.search);
    },
  },
  created() {
    this.GetDeletedFiles();
  },
  watch: {
    deletedFiles(newValue) {
      this.searched = newValue;
      console.log(this.searched);
      console.log(newValue);
    },
  },
});
</script>
