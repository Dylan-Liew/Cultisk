<template>
  <div class="PasswordCreate">
    <div class="card" style="width: 80%; margin: 0 auto;">
      <div class="card-header font-weight-bold">
        Item Information
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <span class="text-muted">Card Name:</span><br>
          <input class="input-field" v-model="name">
        </li>
        <li class="list-group-item">
          <span class="text-muted">Card Brand:</span><br>
          <md-field>
            <md-select v-model="brand">
              <md-option value="Visa">Visa</md-option>
              <md-option value="MasterCard">MasterCard</md-option>
              <md-option value="AMEX">AMEX</md-option>
            </md-select>
          </md-field>
        </li>
        <li class="list-group-item">
          <span class="text-muted">Credit Card Number:</span>
          <br>
          <input class="input-field" v-model="ccNumber">
        </li>
        <li class="list-group-item">
          <span class="text-muted">Expiry Month:</span><br>
          <md-field>
            <md-select v-model="expiryMonth">
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
            <md-select v-model="expiryYear">
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
                 v-model="ccv" id="password"/>
         <button class="btn float-right p-0 mx-1 mt-2" @click.prevent="maskCCV">
            <i class="fa" :class="ccvMasking ? 'fa-eye' : 'fa-eye-slash'"  id="mask-button"></i>
          </button>
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
import { CardEntry } from '@/types/custom.d';

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
    ccNumber: '',
    brand: '',
    expiryYear: '',
    name: '',
    expiryMonth: '',
    ccv: '',
    ccvMasking: true,
  }),
  methods: {
    ...mapActions(['RetrievePWManagerData']),
    CopyToClip() {
      clipboard.writeText(this.ccNumber);
    },
    onCancel() {
      this.$router.push('/password-manager/cards');
    },
    maskCCV() {
      this.ccvMasking = !this.ccvMasking;
    },
    onSave() {
      const data: CardEntry = {
        name: this.name,
        brand: this.brand,
        number: this.ccNumber,
        ccv: this.ccv,
        expiry_year: this.expiryYear,
        expiry_month: this.expiryMonth,
      };
      this.$store.dispatch('AddNewCardEntry', data).then(() => {
        this.$router.push('/password-manager/cards');
      });
    },
  },
});
</script>
