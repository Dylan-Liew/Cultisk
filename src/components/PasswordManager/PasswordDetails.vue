<template>
  <div class="PasswordDetail">
    <div class="card" style="width: 50%; margin:100px auto;">
      <div class="card-header">
        Item Information
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><span class="font-weight-bold">Account Name:</span><br>{{ selectedPassword.name }}</li>
        <li class="list-group-item"><span class="font-weight-bold">Username:</span><br>{{ selectedPassword.username }}</li>
        <li class="list-group-item"><span class="font-weight-bold">
          Password:</span><br>
          <input class="password-field float-left"
                 :type="passwordMasking ? 'password' : 'text'"
                 :value="selectedPassword.password" id="password" disabled>
          <button class="btn float-right" @click="masking">
            <i class="fa" :class="passwordMasking ? 'fa-eye' : 'fa-eye-slash'" id="mask-button"></i>
          </button>
        </li>
        <li class="list-group-item" v-if="selectedPassword.url">
          <span class="font-weight-bold">URL:</span>
          <br>{{ selectedPassword.url }}
        </li>
        <li class="list-group-item" v-if="selectedPassword.otpSecret"><span class="font-weight-bold">TOTP secret:</span>
          <br>{{ selectedPassword.otpSecret }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .password-field{
    border: none;
    background: white;
  }
</style>
<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'PasswordDetails',
  computed: mapGetters(['isUnlocked', 'selectedPassword']),
  data: () => ({
    passwordMasking: true,
    editMode: false,
  }),
  methods: {
    ...mapActions(['getPasswordByUUID']),
    masking() {
      this.passwordMasking = !this.passwordMasking;
    },
  },
  // Magic to get Decrypted info from getter based on UUID
});
</script>
