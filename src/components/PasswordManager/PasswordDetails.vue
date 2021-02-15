<template>
  <div class="PasswordDetail">
    <div class="card" style="width: 80%; margin:50px auto;">
      <div class="card-header font-weight-bold">
        Item Information
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <span class="text-muted">Account Name:</span><br>
          <input class="input-field" v-model="name" :disabled="!editMode">
        </li>
        <li class="list-group-item">
          <span class="text-muted">Username:</span><br>
          <input class="input-field" v-model="username" :disabled="!editMode">
        <li class="list-group-item"><span class="text-muted">
          Password:</span><br>
          <input class="input-field float-left" :type="passwordMasking ? 'password' : 'text'"
                 v-model="password" id="password" :disabled="!editMode">
          <button class="btn float-right p-0" @click.prevent="masking">
            <i class="fa" :class="passwordMasking ? 'fa-eye' : 'fa-eye-slash'"  id="mask-button"></i>
          </button>
          <button class="btn float-right p-0 mr-2" @click.prevent="CopyToClip(password)">
            <i class="fa fa-copy"></i>
          </button>
        </li>
        <li class="list-group-item" v-if="selectedPassword.url || editMode">
          <span class="text-muted">URL:</span>
          <br>
          <input class="input-field" v-model="url" :disabled="!editMode">
        </li>
        <li class="list-group-item" v-if="selectedPassword.totp_secret || editMode"><span class="text-muted">TOTP secret:</span>
          <br>
          <input class="input-field" v-model="totp_secret" :disabled="!editMode">
        </li>
      </ul>
    </div>
    <div v-if="selectedPassword.note || editMode" class="card" style="width: 80%; margin:50px auto;">
        <div class="card-header text-muted">
          Note:
        </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <textarea class="input-field" v-model="note" :disabled="!editMode"/>
        </li></ul>
    </div>
    <BottomButtons :editing="editMode" @onCancel="onCancel" @onSave="onSave" @onEdit="onEdit" @onDelete="onDelete"/>
  </div>
</template>

<style scoped lang="scss">
</style>
<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import BottomButtons from '@/components/PasswordManager/BottomButtons.vue';
import { PasswordEntry } from '@/types/custom.d';

const { clipboard } = require('electron').remote;

export default Vue.extend({
  name: 'PasswordDetails',
  computed: mapGetters(['isUnlocked', 'selectedPassword']),
  components: {
    BottomButtons,
  },
  data: () => ({
    passwordMasking: true,
    editMode: false,
    url: '',
    note: '',
    username: '',
    password: '',
    totp_secret: '',
    name: '',
  }),
  methods: {
    ...mapActions(['getPasswordByUUID', 'RemovePasswordEntry']),
    masking() {
      this.passwordMasking = !this.passwordMasking;
    },
    CopyToClip(password: string) {
      clipboard.writeText(password);
    },
    onCancel() {
      this.editMode = false;
    },
    onEdit() {
      this.editMode = true;
    },
    onDelete() {
      const data: PasswordEntry = {
        username: this.username,
        name: this.name,
        password: this.password,
        uuid: this.selectedPassword.uuid,
        favorite: this.selectedPassword.favorite,
        type: this.selectedPassword.type,
        deleted: true,
      };
      this.$store.dispatch('UpdatePasswordEntry', data).then(() => {
        this.RemovePasswordEntry(this.selectedPassword.uuid);
        this.$router.push('/password-manager/');
      });
    },
    onSave() {
      const data: PasswordEntry = {
        username: this.username,
        name: this.name,
        password: this.password,
        uuid: this.selectedPassword.uuid,
        favorite: this.selectedPassword.favorite,
        type: this.selectedPassword.type,
        deleted: false,
      };
      if (this.note) {
        data.note = this.note;
      }
      if (this.totp_secret) {
        data.totp_secret = this.totp_secret;
      }
      if (this.url) {
        data.url = this.url;
      }
      this.$store.dispatch('UpdatePasswordEntry', data).then(() => {
        this.$router.push('/password-manager/');
      });
    },
  },
  mounted() {
    this.note = this.selectedPassword.note || null;
    this.url = this.selectedPassword.url || null;
    this.username = this.selectedPassword.username;
    this.name = this.selectedPassword.name;
    this.password = this.selectedPassword.password;
    this.totp_secret = this.selectedPassword.totp_secret || null;
  },
  beforeRouteUpdate(to, from, next) {
    if (Object.prototype.hasOwnProperty.call(to.params, 'uuid')) {
      this.getPasswordByUUID(to.params.uuid);
    }
  },
});
</script>
