<template>
  <div class="index">
    <b-container class="position-fixed">
        <b-row>
          <b-col cols="6" >
              <md-table class="p-entries mt-2" md-height="590px" v-model="passwords" md-card @md-selected="onSelect" md-fixed-header>
              <md-table-row class="content" slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
                <md-table-cell md-label="Passwords Manager" md-sort-by="id">
                    <span class="font-weight-bold">{{item.name}}</span><br>
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
                  <li class="list-group-item"><span class="font-weight-bold">Account Name:</span><br>{{ selected.name }}</li>
                  <li class="list-group-item"><span class="font-weight-bold">Username:</span><br>{{ selected.username }}</li>
                  <li class="list-group-item"><span class="font-weight-bold">
                    Password:</span><br>
                    <input class="password-field float-left" type="password" :value="selected.password" id="password" disabled>
                    <button class="btn float-right" v-on:click="masking"><i class="fa fa-eye" id="mask-button"></i></button>
                  </li>
                  <li class="list-group-item" v-if="selected.url">
                    <span class="font-weight-bold">URL:</span>
                    <br>{{ selected.url }}
                  </li>
                  <li class="list-group-item" v-if="selected.otpSecret"><span class="font-weight-bold">TOTP secret:</span>
                    <br>{{ selected.otpSecret }}
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
    passwords: [
      {
        uuid: '593bfd33-56d9-45f1-b2cf-2fd297316225',
        name: 'My Google account',
        username: 'test@gmail.com',
        password: 'text',
        url: 'www.google.com',
      },
      {
        uuid: '8eaa423b-2a63-42cb-a977-b38515e85da6',
        name: 'My facebook account',
        username: 'test@gmail.com',
        password: 'text',
        otpSecret: '5567890f',
        url: 'www.facebook.com',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
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
