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
                        <md-select v-model="filterBy">
                          <md-option value="all">All</md-option>
                          <md-option value="favourite">Favourite</md-option>
                        </md-select>
                      </md-field>
                    </div>
                  </b-col>
                </b-row>
              </b-container>
            </md-table-toolbar>
            <md-table-row class="content" slot="md-table-row" :key="item.uuid" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
              <md-table-cell md-sort-by="name">
                <span class="font-weight-bold float-left">{{item.name}}</span>
                <i v-if="item.leaked" class="ml-2 fas fa-exclamation-circle" :title="`Your password for this account has been exposed ${item.exposedCount}`"></i>
                <div v-if="item.favorite" @click.prevent="ToggleFavorite(item)" class="fa fa-star float-right checked"></div>
                <div v-else @click.prevent="ToggleFavorite(item)" class="fa fa-star float-right"></div>
                <br>
                {{item.username}}
              </md-table-cell>
            </md-table-row>
          </md-table>
          <div class="text-center mt-1">
            <b-button variant="primary" @click.prevent="$router.push('/password-manager/password-create')">Add Password</b-button>
          </div>
        </b-col>
        <b-col cols="6" v-if="$route.name==='Password Manager' && selected">
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
        </b-col>
        <b-col cols="6" v-else-if="$route.name==='Password Manager' && !selected">
        </b-col>
        <b-col cols="6" v-else>
          <router-view/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import BottomButtons from '@/components/PasswordManager/BottomButtons.vue';
import { PasswordEntry } from '@/types/custom.d';
import { PasswordEntryStore } from '@/store/modules/PasswordManager';

const { clipboard } = require('electron').remote;

const toLower = (text: string) => text.toString().toLowerCase();

const searchByName = (items: PasswordEntryStore[], term: string | null) => {
  if (term !== null) {
    return items.filter((item) => toLower(item.name).includes(toLower(term)));
  }

  return items;
};

export default Vue.extend({
  name: 'PasswordManagerIndex',
  components: {
    BottomButtons,
  },
  data: () => ({
    passwords: [],
    search: '',
    selected: null,
    filterBy: 'all',
    createMode: false,
    passwordMasking: true,
    editMode: false,
    url: '',
    note: '',
    username: '',
    password: '',
    totp_secret: '',
    name: '',
  }),
  computed: mapGetters(['selectedPassword', 'allPasswords', 'isUnlocked', 'allCards']),
  methods: {
    ...mapActions(['RetrievePWManagerData', 'getPasswordByUUID', 'RemovePasswordEntry']),
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
      });
    },
    onSave() {
      const data: PasswordEntryStore = {
        ...this.selectedPassword,
        username: this.username,
        name: this.name,
        password: this.password,
        encrypted: false,
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
      this.$store.dispatch('UpdatePasswordEntry', data);
      this.editMode = false;
    },
    getClass: ({ name }: never) => ({
      'md-primary': name,
    }),
    onSelect(item: PasswordEntryStore) {
      this.getPasswordByUUID(item.uuid);
    },
    ToggleFavorite(item) {
      const data: PasswordEntryStore = {
        ...item,
        favorite: !this.item.favorite,
      };
      this.$store.dispatch('UpdatePasswordEntry', data);
    },
    searchOnTable() {
      this.passwords = searchByName(this.allPasswords, this.search);
    },
  },
  created() {
    if (!this.isUnlocked) {
      this.$router.push('/password-manager/unlock/?dest=password');
    } else {
      this.RetrievePWManagerData();
    }
  },
  watch: {
    allPasswords(newValue) {
      this.passwords = newValue;
    },
    selectedPassword(newValue) {
      this.selected = newValue || null;
      this.note = newValue.note || null;
      this.url = newValue.url || null;
      this.username = newValue.username;
      this.name = newValue.name;
      this.password = newValue.password;
      this.totp_secret = newValue.totp_secret || null;
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
.password-manager .input-field{
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
  opacity: 0.7;
}
.fa-exclamation-circle{
  color: red;
}

</style>
