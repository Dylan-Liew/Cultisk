<template>
  <div class="PasswordDetail">
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
  </div>
</template>

<style scoped lang="scss">
</style>
<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import BottomButtons from '@/components/PasswordManager/BottomButtons.vue';
import { CardEntry } from '@/types/custom.d';

const { clipboard } = require('electron').remote;

export default Vue.extend({
  name: 'CardDetails',
  computed: mapGetters(['isUnlocked', 'selectedCard']),
  components: {
    BottomButtons,
  },
  data: () => ({
    ccvMasking: true,
    editMode: false,
    name: '',
    expiryMonth: '',
    expiryYear: '',
    ccNumber: '',
    brand: '',
    ccv: '',
  }),
  methods: {
    ...mapActions(['RemoveCardEntry', 'getCardByUUID']),
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
        uuid: this.selectedCard.uuid,
        ccv: this.ccv,
        favorite: this.selectedCard.favorite,
        type: this.selectedCard.type,
        deleted: true,
      };
      this.$store.dispatch('UpdateCardEntry', data).then(() => {
        this.RemoveCardEntry(this.selectedCard.uuid);
        this.$router.push('/password-manager/cards');
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
      this.$store.dispatch('UpdateCardEntry', data).then(() => {
        this.$router.push('/password-manager/cards');
      });
    },
  },
  mounted() {
    this.ccv = this.selectedCard.ccv;
    this.name = this.selectedCard.name;
    this.ccNumber = this.selectedCard.number;
    this.brand = this.selectedCard.brand;
    this.expiryMonth = this.selectedCard.expiry_month;
    this.expiryYear = this.selectedCard.expiry_year;
  },
  beforeRouteUpdate(to, from, next) {
    if (Object.prototype.hasOwnProperty.call(to.params, 'uuid')) {
      this.getCardByUUID(to.params.uuid);
    }
    next();
  },
});
</script>
