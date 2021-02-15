<template>
  <div class="PasswordCreate">
    <div class="card" style="width: 80%; margin:50px auto;">
      <div class="card-header font-weight-bold">
        Item Information
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <span class="text-muted">Account Name:</span><br>
          <input class="input-field" v-model="name">
        </li>
        <li class="list-group-item">
          <span class="text-muted">Username:</span><br>
          <input class="input-field" v-model="username">
        <li class="list-group-item"><span class="text-muted">
          Password:</span><br>
          <input class="input-field float-left" :type="passwordMasking ? 'password' : 'text'"
                 v-model="password" id="password"/>
         <button class="btn float-right p-0 mx-1 mt-2" @click.prevent="maskPassword">
            <i class="fa" :class="passwordMasking ? 'fa-eye' : 'fa-eye-slash'"  id="mask-button"></i>
          </button>
          <button class="btn float-right p-0 mt-2 mx-1" @click.prevent="genPassword" >
            <i class="fa fa-sync-alt" ></i>
          </button>
          <button class="btn float-right p-0 mt-2 mx-1" @click.prevent="CopyToClip">
            <i class="fa fa-copy"></i>
          </button>
        </li>
        <li class="list-group-item">
          <span class="text-muted">URL:</span>
          <br>
          <input class="input-field" v-model="url">
        </li>
        <li class="list-group-item"><span class="text-muted">TOTP secret:</span>
          <br>
          <input class="input-field" v-model="totp_secret">
        </li>
      </ul>
    </div>
    <div class="card" style="width: 80%; margin:50px auto;">
        <div class="card-header text-muted">
          Note:
        </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <input class="input-field" v-model="note">
        </li>
      </ul>
    </div>
    <BottomButtons
      :editing="editMode"
      @onCancel="onCancel"
      @onSave="onSave"
    />
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import Vue from 'vue';
import BottomButtons from '@/components/PasswordManager/BottomButtons.vue';
import { mapActions, mapGetters } from 'vuex';
import { PasswordEntry } from '@/types/custom.d';

const generator = require('generate-password');
const { clipboard } = require('electron').remote;

export default Vue.extend({
  name: 'PasswordCreate',
  computed: mapGetters([]),
  components: {
    BottomButtons,
  },
  data: () => ({
    editMode: true,
    note: '',
    totp_secret: '',
    password: '',
    url: '',
    name: '',
    username: '',
    passwordMasking: true,
  }),
  methods: {
    ...mapActions(['RetrievePWManagerData']),
    genPassword() {
      this.password = generator.generate({
        length: 12,
        symbols: true,
        strict: true,
        numbers: true,
      });
    },
    CopyToClip() {
      clipboard.writeText(this.password);
    },
    maskPassword() {
      this.passwordMasking = !this.passwordMasking;
    },
    onCancel() {
      this.$router.push('/password-manager/');
    },
    onSave() {
      const data: PasswordEntry = {
        username: this.username,
        name: this.name,
        password: this.password,
      };
      if (this.note.length !== 0) {
        data.note = this.note;
      }
      if (this.totp_secret.length !== 0) {
        data.totp_secret = this.totp_secret;
      }
      if (this.url.length !== 0) {
        data.url = this.url;
      }
      this.$store.dispatch('AddNewPasswordEntry', data).then(() => {
        this.$router.push('/password-manager/');
      });
    },
  },
});
</script>
