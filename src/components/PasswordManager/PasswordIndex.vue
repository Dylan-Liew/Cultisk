<template>
  <div class="index">
    <b-container class="position-fixed">
        <b-row class="bv-example-row">
          <b-col class="p-entry-container" cols="4" >
              <md-table class="mt-2" md-height="590px" v-model="people" md-card @md-selected="onSelect" md-fixed-header>
              <md-table-row class="content" slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
                <md-table-cell md-label="Passwords Manager" md-sort-by="id">
                    <span class="font-weight-bold">{{item.id}}</span><br>
                    {{item.name}}
                </md-table-cell>
              </md-table-row>
            </md-table>
          </b-col>
          <b-col cols="8">
              <div class="card" style="width: 18rem;">
                <div class="card-header">
                  Featured
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Cras justo odio</li>
                  <li class="list-group-item">Dapibus ac facilisis in</li>
                  <li class="list-group-item">Vestibulum at eros</li>
                </ul>
              </div>
            <p>Selected:</p>
            {{ selected }}
          </b-col>
        </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TableSingle',
  data: () => ({
    selected: {},
    people: [
      {
        id: 'www.google.com',
        name: 'test@gmail.com',
        email: 'text',
      },
      {
        id: 2,
        name: 'Shawna Dubbin',
        email: 'text',
      },
      {
        id: 3,
        name: 'Shawna Dubbin',
        email: 'text',
      },
      {
        id: 4,
        name: 'Shawna Dubbin',
        email: 'text',
      },
      {
        id: 5,
        name: 'Shawna Dubbin',
        email: 'text',
      },
      {
        id: 6,
        name: 'Shawna Dubbin',
        email: 'text',
      },
      {
        id: 7,
        name: 'Shawna Dubbin',
        email: 'text',
      },
      {
        id: 8,
        name: 'Shawna Dubbin',
        email: 'text',
      },
      {
        id: 9,
        name: 'Shawna Dubbin',
        email: 'text',
      },
      {
        id: 10,
        name: 'Shawna Dubbin',
        email: 'text',
      },
      {
        id: 11,
        name: 'Shawna Dubbin',
        email: 'text',
      },
      {
        id: 12,
        name: 'Shawna Dubbin',
        email: 'text',
      },
      {
        id: 13,
        name: 'Shawna Dubbin',
        email: 'text',
      },
      {
        id: 14,
        name: 'Shawna Dubbin',
        email: 'text',
      },
    ],
  }),
  methods: {
    getClass: ({ id }) => ({
      'md-primary': id,
    }),
    onSelect(item) {
      this.selected = item;
    },
  },
});
</script>

<style scoped>
</style>
