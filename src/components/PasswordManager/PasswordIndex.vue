<template>
  <div class="index">
    <b-container class="position-fixed">
        <b-row>
          <b-col cols="6" >
              <md-table class="p-entries mt-2" md-height="590px" v-model="people" md-card @md-selected="onSelect" md-fixed-header>
              <md-table-row class="content" slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
                <md-table-cell md-label="Passwords Manager" md-sort-by="id">
                    <span class="font-weight-bold">{{item.wname}}</span><br>
                    {{item.username}}
                </md-table-cell>
              </md-table-row>
            </md-table>
          </b-col>
          <b-col cols="6">
              <div class="card" style="width: 50%; margin:100px auto;">
                  <div class="card-header">
                    Item Information
                  </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item"><span class="font-weight-bold">Website Name:</span><br>{{ selected.wname }}</li>
                  <li class="list-group-item"><span class="font-weight-bold">Username:</span><br>{{ selected.username }}</li>
                  <li class="list-group-item"><span class="font-weight-bold">Password:</span><br>{{ selected.password }}</li>
                </ul>
              </div>
          </b-col>
        </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  username: 'TableSingle',
  data: () => ({
    selected: {},
    people: [
      {
        wname: 'www.google.com',
        username: 'test@gmail.com',
        password: 'text',
      },
      {
        wname: 2,
        username: 'Shawna Dubbin',
        password: 'text',
      },
      {
        wname: 3,
        username: 'Shawna Dubbin',
        password: 'text',
      },
      {
        wname: 4,
        username: 'Shawna Dubbin',
        password: 'text',
      },
      {
        wname: 5,
        username: 'Shawna Dubbin',
        password: 'text',
      },
      {
        wname: 6,
        username: 'Shawna Dubbin',
        password: 'text',
      },
      {
        wname: 7,
        username: 'Shawna Dubbin',
        password: 'text',
      },
      {
        wname: 8,
        username: 'Shawna Dubbin',
        password: 'text',
      },
      {
        wname: 9,
        username: 'Shawna Dubbin',
        password: 'text',
      },
      {
        wname: 10,
        username: 'Shawna Dubbin',
        password: 'text',
      },
      {
        wname: 11,
        username: 'Shawna Dubbin',
        password: 'text',
      },
      {
        wname: 12,
        username: 'Shawna Dubbin',
        password: 'text',
      },
      {
        wname: 13,
        username: 'Shawna Dubbin',
        password: 'text',
      },
      {
        wname: 14,
        username: 'Shawna Dubbin',
        password: 'text',
      },
    ],
  }),
  methods: {
    getClass: ({ wname }) => ({
      'md-primary': wname,
    }),
    onSelect(item) {
      this.selected = item;
    },
  },
});
</script>

<style scoped>
.p-entries{
  width: 70%;
  margin: auto;
}
</style>
