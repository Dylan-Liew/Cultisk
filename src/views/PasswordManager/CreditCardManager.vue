<template>
  <div class="index">
    <b-container class="password-manager position-fixed">
      <b-row>
        <b-col cols="6" style="left:0;">
          <md-table class="p-entries mt-1 mx-auto w-75 test" md-height="100%" v-model="CCards" md-card @md-selected="onSelect" md-fixed-header>
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
                <div v-if="item.favorite" @click="ToggleFavorite(item)" class="fa fa-star float-right checked" ></div>
                <div v-else @click="ToggleFavorite(item)" class="fa fa-star float-right"></div>
                <br>
                {{item.displayMasked}}
              </md-table-cell>
            </md-table-row>
          </md-table>
          <div class="text-center mt-1">
            <b-button variant="primary" @click.prevent="$router.push('/password-manager/cards/card-create')">Add Card</b-button>
          </div>
        </b-col>
        <b-col cols="6" v-if="$route.name==='Card Manager' && selected">
          <div class="card" style="width: 80%; margin: 0 auto;">
            <div class="card-header font-weight-bold">
              Item Information
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <span class="text-muted">Card Name:</span><br>
                <input class="input-field" v-model="name" :disabled="!editMode">
              </li>
              <li class="list-group-item">
                <span class="text-muted">Card Brand:</span><br>
                <md-field>
                  <md-select v-model="brand" :disabled="!editMode">
                    <md-option value="Visa">Visa</md-option>
                    <md-option value="MasterCard">MasterCard</md-option>
                    <md-option value="AMEX">AMEX</md-option>
                  </md-select>
                </md-field>
              </li>
              <li class="list-group-item">
                <span class="text-muted">Credit Card Number:</span>
                <br>
                <input class="input-field" v-model="ccNumber" :disabled="!editMode">
                <button class="btn float-right p-0 mr-2" @click.prevent="CopyToClip(ccNumber)">
                  <i class="fa fa-copy"></i>
                </button>
              </li>
              <li class="list-group-item">
                <span class="text-muted">Expiry Month:</span><br>
                <md-field>
                  <md-select v-model="expiryMonth" :disabled="!editMode">
                    <md-option value="1">01</md-option>
                    <md-option value="2">02</md-option>
                    <md-option value="3">03</md-option>
                    <md-option value="4">04</md-option>
                    <md-option value="5">05</md-option>
                    <md-option value="6">06</md-option>
                    <md-option value="7">07</md-option>
                    <md-option value="8">08</md-option>
                    <md-option value="9">09</md-option>
                    <md-option value="10">10</md-option>
                    <md-option value="11">11</md-option>
                    <md-option value="12">12</md-option>
                  </md-select>
                </md-field>
              </li>
              <li class="list-group-item">
                <span class="text-muted">Expiry Year:</span><br>
                <md-field>
                  <md-select v-model="expiryYear" :disabled="!editMode">
                    <md-option value="2023">2023</md-option>
                    <md-option value="2024">2024</md-option>
                    <md-option value="2025">2025</md-option>
                    <md-option value="2026">2026</md-option>
                    <md-option value="2027">2027</md-option>
                    <md-option value="2028">2028</md-option>
                    <md-option value="2029">2029</md-option>
                    <md-option value="2030">2030</md-option>
                    <md-option value="2031">2031</md-option>
                    <md-option value="2032">2032</md-option>
                  </md-select>
                </md-field>
              </li>
              <li class="list-group-item"><span class="text-muted">
                CVC:</span><br>
                <input class="input-field float-left" :type="ccvMasking ? 'password' : 'text'"
                       v-model="ccv" id="password" :disabled="!editMode"/>
               <button class="btn float-right p-0 mx-1 mt-2" @click.prevent="maskCCV">
                  <i class="fa" :class="ccvMasking ? 'fa-eye' : 'fa-eye-slash'"  id="mask-button"></i>
                </button>
              </li>
            </ul>
          </div>
          <BottomButtons :editing="editMode" @onCancel="onCancel" @onSave="onSave" @onEdit="onEdit" @onDelete="onDelete"/>
        </b-col>
        <b-col cols="6" v-else-if="$route.name==='Card Manager' && !selected">
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
import { CardEntryStore } from '@/store/modules/PasswordManager';
import BottomButtons from '@/components/PasswordManager/BottomButtons.vue';
import { CardEntry } from '@/types/custom.d';

const { clipboard } = require('electron').remote;

const toLower = (text: string) => text.toString().toLowerCase();

const searchByName = (items: CardEntryStore[], term: string | null) => {
  if (term !== null) {
    return items.filter((item) => toLower(item.name).includes(toLower(term)));
  }

  return items;
};

export default Vue.extend({
  name: 'CreditCardManagerIndex',
  components: {
    BottomButtons,
  },
  data: () => ({
    selected: null,
    search: '',
    CCards: [],
    filterBy: 'all',
    ccvMasking: true,
    editMode: false,
    name: '',
    expiryMonth: '',
    expiryYear: '',
    ccNumber: '',
    brand: '',
    ccv: '',
  }),
  computed: mapGetters(['selectedCard', 'isUnlocked', 'allCards']),
  methods: {
    ...mapActions(['RetrievePWManagerData', 'getCardByUUID', 'FavouriteToggleCardEntry', 'RemoveCardEntry', 'getCardByUUID']),
    masking() {
      this.ccvMasking = !this.ccvMasking;
    },
    maskCCV() {
      this.ccvMasking = !this.ccvMasking;
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
      const data: CardEntry = {
        ...this.selectedCard,
        name: this.name,
        brand: this.brand,
        expiry_year: this.expiryYear,
        expiry_month: this.expiryMonth,
        number: this.ccNumber,
        ccv: this.ccv,
        deleted: true,
      };
      this.$store.dispatch('UpdateCardEntry', data).then(() => {
        this.RemoveCardEntry(this.selectedCard.uuid);
      });
    },
    onSave() {
      const displayMasked = `${this.brand}, *${this.ccNumber.slice(-4)}`;
      const data: CardEntry = {
        ...this.selectedCard,
        displayMasked,
        name: this.name,
        brand: this.brand,
        expiry_year: this.expiryYear,
        expiry_month: this.expiryMonth,
        number: this.ccNumber,
        uuid: this.selectedCard.uuid,
        ccv: this.ccv,
        favorite: this.selectedCard.favorite,
        type: this.selectedCard.type,
        deleted: false,
      };
      this.$store.dispatch('UpdateCardEntry', data);
      this.editMode = false;
    },
    getClass: ({ name }: never) => ({
      'md-primary': name,
    }),
    onSelect(item: CardEntryStore) {
      this.getCardByUUID(item.uuid);
    },
    ToggleFavorite(item) {
      const data: CardEntryStore = {
        ...item,
        favorite: !item.favorite,
      };
      this.$store.dispatch('UpdateCardEntry', data);
    },
    searchOnTable() {
      this.CCards = searchByName(this.allCards, this.search);
    },
  },
  created() {
    if (!this.isUnlocked) {
      this.$router.push('/password-manager/unlock/?dest=card');
    } else {
      this.RetrievePWManagerData();
    }
  },
  watch: {
    allCards(newValue) {
      this.CCards = newValue;
    },
    selectedCard(newValue: CardEntryStore) {
      this.selected = newValue || null;
      this.name = newValue.name;
      this.ccv = newValue.ccv;
      this.brand = newValue.brand;
      this.ccNumber = newValue.number;
      this.expiryMonth = newValue.expiry_month;
      this.expiryYear = newValue.expiry_year;
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
