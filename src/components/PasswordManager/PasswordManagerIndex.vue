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
                    <input class="password-field float-left" :type="passwordMasked ? 'password' : 'text'"
                           :value="selected.password" id="password" disabled>
                    <button class="btn float-right" v-on:click="masking">
                      <i class="fa" :class="passwordMasked ? 'fa-eye' : 'fa-eye-slash'"  id="mask-button"></i>
                    </button>
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

<style lang="scss" scoped>
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

<script lang="js">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'PasswordManagerIndex',
  data: () => ({
    selected: {},
    passwords: [
      {
        uuid: '593bfd33-56d9-45f1-b2cf-2fd297316225',
        name: 'My Google account',
        username: 'test@gmail.com',
        password: 'text',
        url: 'www.google.com',
        note: 'this is my main account',
      },
      {
        uuid: '8eaa423b-2a63-42cb-a977-b38515e85da6',
        name: 'My facebook account',
        username: 'scam@gmail.com',
        password: 'text',
        url: 'www.facebook.com',
        note: 'this is my catfish account',
      },
      {
        uuid: '8eaa423b-2a63-42cb-a977-b38515e85da6',
        name: 'My facebook account',
        username: 'test@gmail.com',
        password: 'text',
        otpSecret: 'rtetgere',
        url: 'www.facebook.com',
        note: 'this is my main account',
      },
      {
        uuid: 'a4fa2765-b54e-4302-8a78-4bc63ddedf34',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '5836c263-d611-4e69-92c4-de6172278d9e',
        name: 'My Online Account 2',
        username: 'test@gmail.com',
        password: 'apassword',
      },
      {
        uuid: '3e3d4cf7-d175-4e04-9ab7-420086bf9e11',
        name: 'Scam Account',
        username: 'scam@gmail.com',
        password: 'hi',
      },
      {
        uuid: '8ad01649-5be0-4af9-ada3-5badf48456a6',
        name: 'My Online Account',
        username: 'scam@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '76f3c1d4-5db0-451b-a69b-e04d97b608d1',
        name: 'My Bitcointalk account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
        totp: 'gdfdfgfwfw',
      },
      {
        uuid: '7a370e20-4f21-4ee6-b4c6-939f10cd6387',
        name: 'My scam Bitcointalk Account',
        username: 'scam@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '0ecd2d95-f62a-48bf-9b49-0ab4fbfc29b1',
        name: 'Adding account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
    ],
    cards: [
      {
        uuid: 'ea803d35-ac08-4e85-b65f-68988f96c709',
        brand: 'Visa',
        number: '4916635451956666',
        expiry_month: '02',
        expiry_year: '2023',
        ccv: '293',
      },
      {
        uuid: '1280aa8e-8af1-4a10-8916-b4bcfb2bbd00',
        brand: 'Mastercard',
        number: '5528807515210946',
        expiry_month: '02',
        expiry_year: '2023',
        ccv: '313',
      },
      {
        uuid: 'dd1b3fd5-200e-499d-9409-f0d22fd99965',
        brand: 'AMEX',
        number: '378008955395048',
        expiry_month: '02',
        expiry_year: '2023',
        ccv: '781',
      },
    ],
    passwordMasked: true,
  }),
  methods: {
    ...mapActions(['RetrievePWManagerData', 'getPasswordByUUID', 'getCardByUUID']),
    getClass: ({ name }) => ({
      'md-primary': name,
    }),
    onSelect(item) {
      this.selected = item;
    },
    masking() {
      this.passwordMasked = !this.passwordMasked;
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
