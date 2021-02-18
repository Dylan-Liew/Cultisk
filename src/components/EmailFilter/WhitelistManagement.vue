<template>
  <div>
    <md-dialog-prompt
      :md-active.sync="active"
      v-model="value"
      md-title="Add Whitelist"
      md-input-placeholder="Enter email to whitelist..."
      md-confirm-text="Confirm"
      @md-confirm="hello(value)"
    />
    <div class="div-top container">
      <div class="row">
        <div class="col text-center">
          <b-button style="width:130px; height: 45px; font-size:1.3em;" variant="primary" @click="active = true">Add</b-button>
        </div>
      </div>
    </div>
    <md-table v-model="searched" md-sort="deleted_time" md-sort-order="asc" md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title font-weight-bold">Email Whitelisting</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search by email..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="No emails found"
        :md-description="`No emails found for this '${search}' query. Try a different search term.`">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Emails" md-sort-by="email">{{ item }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<style scoped>
  .md-table{
    height: 570px;
    width: 950px;
    position: fixed;
    top: 53%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow-x: hidden; /* Hide horizontal scrollbar */
  }
  .md-field {
    max-width: 300px;
  }
  .div-top{
    position: fixed;
    top: 5%;
    left: 80%;
    transform: translate(-50%, -50%);
  }
</style>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

const toLower = (text) => text.toString().toLowerCase();

const searchByName = (items, term) => {
  if (term) {
    return items.filter((item) => toLower(item.name).includes(toLower(term)));
  }

  return items;
};

export default Vue.extend({
  name: 'Deletedemails',
  data: () => ({
    search: null,
    searched: [],
    active: false,
    value: null,
  }),
  methods: {
    ...mapActions(['RetrieveSpamFilterInfo']),
    searchOnTable() {
      this.searched = searchByName(this.GetWhiteList, this.search);
    },
    hello(text) {
      this.whitelist.push(text);
    },
  },
  computed: mapGetters(['GetWhiteList']),
  created() {
    this.GetWhiteList();
  },
  watch: {
    GetWhiteList(newValue) {
      this.searched = newValue;
    },
  },
});
</script>
