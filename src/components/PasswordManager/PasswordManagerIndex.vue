<template>
  <div class="index">
    <b-container class="password-manager position-fixed">
        <b-row>
          <b-col cols="6" style="left:0;">
              <md-table class="p-entries mt-1 mx-auto w-75 test" md-height="100%" v-model="passwords" md-card @md-selected="onSelect" md-fixed-header>
              <md-table-toolbar>
                <b-container>
                  <b-row>
                    <b-col cols="8">
                      <md-field md-clearable class="md-toolbar-section-start">
                        <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
                      </md-field>
                    </b-col>
                    <b-col cols="4">
                      <div class="md-layout-item">
                        <md-field>
                          <md-select v-model="filtervalue">
                            <md-option value="all">All</md-option>
                            <md-option value="favourite">Favourite</md-option>
                          </md-select>
                        </md-field>
                      </div>
                    </b-col>
                  </b-row>
                </b-container>
              </md-table-toolbar>
              <md-table-row class="content" slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
                <md-table-cell md-sort-by="name">
                    <span class="font-weight-bold float-left">{{item.name}}</span>
                    <div v-if="item.favourite===true" v-on:click="favourite" class="fa fa-star float-right checked"></div>
                    <div v-else v-on:click="favourite" class="fa fa-star float-right"></div>
                    <br>
                    {{item.username}}
                </md-table-cell>
              </md-table-row>
            </md-table>
            <div class="text-center mt-1">
              <b-button variant="primary" v-b-modal.modal-prevent-closing>Add Password</b-button>
            </div>
          </b-col>
          <b-col v-if="selected.name" cols="6">
              <div class="card" style="width: 80%; margin:50px auto;">
                <div class="card-header font-weight-bold">
                  Item Information
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item"><span class="text-muted">Account Name:</span><br>{{ selected.name }}</li>
                  <li class="list-group-item"><span class="text-muted">Username:</span><br>{{ selected.username }}</li>
                  <li class="list-group-item"><span class="text-muted">
                    Password:</span><br>
                    <input class="password-field float-left" :type="userPassMasked ? 'password' : 'text'"
                           :value="selected.password" id="password" disabled>
                    <button class="btn float-right p-0" v-on:click="maskUserPass">
                      <i class="fa" :class="userPassMasked ? 'fa-eye' : 'fa-eye-slash'"  id="mask-button"></i>
                    </button>
                    <button class="btn float-right p-0 mr-2" @click.prevent="x">
                      <i class="fa fa-copy"></i>
                    </button>
                  </li>
                  <li class="list-group-item" v-if="selected.url">
                    <span class="text-muted">URL:</span>
                    <br>{{ selected.url }}
                  </li>
                  <li class="list-group-item" v-if="selected.otpSecret"><span class="text-muted">TOTP secret:</span>
                    <br>{{ selected.otpSecret }}
                  </li>
                </ul>
              </div>
              <div v-if="selected.note" class="card" style="width: 80%; margin:50px auto;">
                  <div class="card-header text-muted">
                    Note:
                  </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    {{ selected.note }}
                  </li></ul>
              </div>
          </b-col>
          <b-col cols="6" v-else>
          </b-col>
        </b-row>
    </b-container>
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Add Password"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="pname"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Username"
          label-for="username-input"
          invalid-feedback="Username is required"
          :state="UsernameState"
        >
          <b-form-input
            id="username-input"
            v-model="username"
            :state="UsernameState"
            required
          ></b-form-input>
        </b-form-group>
        <label for="text-password">Password</label>
        <b-form-input class="float-left" style="width:85%;" :value="addpassword" :type="addPassMasked ? 'password' : 'text'" id="text-password" aria-describedby="password-help-block"></b-form-input>
        <button class="btn float-right p-0 mt-2 mx-1" @click.prevent="copy" >
          <i class="fa fa-sync-alt" ></i>
        </button>
        <button class="btn float-right p-0 mt-2 mx-2" @click.prevent="maskAddPass" >
          <i class="fa" :class="addPassMasked ? 'fa-eye' : 'fa-eye-slash'"></i>
        </button>
        <b-form-group
          label="Authenticator Key (TOTP)"
          label-for="totp-input"
          :state="totpState"
        >
          <b-form-input
            id="totp-input"
            v-model="totp"
            :state="totpState"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="URL"
          label-for="url-input"
          :state="urlState"
        >
          <b-form-input
            id="url-input"
            v-model="url"
            :state="urlState"
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'PasswordManagerIndex',
  data: () => ({
    selected: {},
    filtervalue: 'all',
    userPassMasked: true,
    favourited: true,
    addPassMasked: true,
    pname: '',
    nameState: null,
    username: '',
    UsernameState: null,
    addpassword: '',
    totp: '',
    totpState: null,
    url: '',
    urlState: null,
    passwords: [
      {
        uuid: '593bfd33-56d9-45f1-b2cf-2fd297316225',
        name: 'My Google account',
        username: 'test@gmail.com',
        password: 'text',
        url: 'www.google.com',
        note: 'this is my main account',
        favourite: true,
      },
      {
        uuid: '8eaa423b-2a63-42cb-a977-b38515e85da6',
        name: 'My facebook account',
        username: 'scam@gmail.com',
        password: 'text',
        url: 'www.facebook.com',
        note: 'this is my catfish account',
        favourite: true,
      },
      {
        uuid: '8eaa423b-2a63-42cb-a977-b38515e85da6',
        name: 'My facebook account',
        username: 'test@gmail.com',
        password: 'text',
        otpSecret: 'rtetgere',
        url: 'www.facebook.com',
        note: 'this is my main account',
        favourite: true,
      },
      {
        uuid: 'a4fa2765-b54e-4302-8a78-4bc63ddedf34',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
        favourite: true,
      },
      {
        uuid: '5836c263-d611-4e69-92c4-de6172278d9e',
        name: 'My Online Account 2',
        username: 'test@gmail.com',
        password: 'apassword',
        favourite: true,
      },
      {
        uuid: '3e3d4cf7-d175-4e04-9ab7-420086bf9e11',
        name: 'Scam Account',
        username: 'scam@gmail.com',
        password: 'hi',
        favourite: true,
      },
      {
        uuid: '8ad01649-5be0-4af9-ada3-5badf48456a6',
        name: 'My Online Account',
        username: 'scam@gmail.com',
        password: 'mysupersecretpassword',
        favourite: true,
      },
      {
        uuid: '76f3c1d4-5db0-451b-a69b-e04d97b608d1',
        name: 'My Bitcointalk account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
        totp: 'gdfdfgfwfw',
        favourite: false,
      },
      {
        uuid: '7a370e20-4f21-4ee6-b4c6-939f10cd6387',
        name: 'My scam Bitcointalk Account',
        username: 'scam@gmail.com',
        password: 'mysupersecretpassword',
        favourite: false,
      },
      {
        uuid: '0ecd2d95-f62a-48bf-9b49-0ab4fbfc29b1',
        name: 'Adding account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
        favourite: false,
      },
      {
        uuid: '0ecd2d95-f62a-48bf-9b49-0ab4fbfc29b1',
        name: 'Adding account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
        favourite: false,
      },
      {
        uuid: '0ecd2d95-f62a-48bf-9b49-0ab4fbfc29b1',
        name: 'Adding account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
        favourite: false,
      },
    ],
  }),
  methods: {
    ...mapActions(['RetrievePWManagerData', 'getPasswordByUUID', 'getCardByUUID']),
    getClass: ({ name }) => ({
      'md-primary': name,
    }),
    onSelect(item) {
      this.selected = item;
    },
    maskUserPass() {
      this.userPassMasked = !this.userPassMasked;
    },
    maskAddPass() {
      this.addPassMasked = !this.addPassMasked;
    },
    favourite() {
      this.favourited = !this.favourited;
    },
    copy() {
      /* Get the text field */
      const copyText = document.getElementById('password');
      /* Select the text field */
      copyText.select();
      /* Copy the text inside the text field */
      document.execCommand('copy');
    },
  },
  watch: {
    allPasswords(newValue) {
      this.passwords = newValue;
    },
    allCards(newValue) {
      this.cards = newValue;
    },
  },
});
</script>

<style lang="scss">
.password-manager .md-table-fixed-header{
  display: none !important;
}
.password-manager .p-entries{
  width: 100%;
  height: 620px;
}
.password-manager .password-field{
  border: none;
  background: white;
}
.password-manager button:focus{
  outline: none;
  box-shadow: none;
}
.password-manager .content{
  height: 100%;
}
.password-manager .checked {
  color: orange;
}
.password-manager .fa:hover{
  color: #007BFF;
}
</style>
