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
                  <li class="list-group-item"><span class="font-weight-bold">
                    Password:</span><br>
                    <input class="password-field float-left" type="password" :value="selected.password" id="password" disabled>
                    <button class="btn float-right" v-on:click="masking"><i class="fa fa-eye" id="mask-button"></i></button>
                  </li>
                </ul>
              </div>
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
.password-field{
  border: none;
  background: white;
}
button:focus{
  outline: none;
  box-shadow: none;
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TableSingle',
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
    masking() {
      const x = document.getElementById('password');
      if (x.type === 'password') {
        x.type = 'text';
        document.getElementById('mask-button').classList.add('fa-eye-slash');
        document.getElementById('mask-button').classList.remove('fa-eye');
      } else {
        x.type = 'password';
        document.getElementById('mask-button').classList.add('fa-eye');
        document.getElementById('mask-button').classList.remove('fa-eye-slash');
      }
    },
  },
});
</script>
