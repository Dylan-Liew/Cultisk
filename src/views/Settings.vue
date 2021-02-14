<template>
<div class="settings-index">
  <div class="card container">
    <div class="card-body">
      <h5 class="card-header m-0">Cultisk - Set Master Password</h5>
      <form>
        <div class="form-group">
          <label for="MasterPassword">Old Password</label>
          <br>
          <input :type="oldMasked ? 'password' : 'text'" class="form-control float-left mb-2 w-90" v-model="oldPassword"  placeholder="Password">
          <button class="btn float-right" @click.prevent="oldMasterPass">
            <i class="fa" :class="oldMasked ? 'fa-eye' : 'fa-eye-slash'"></i>
          </button>
        </div>
        <div class="form-group">
          <label for="MasterPassword">New Password</label>
          <br>
          <input :type="masterMasked ? 'password' : 'text'" class="form-control float-left mb-2 w-90" v-model="masterPassword" id="MasterPassword" placeholder="Password">
          <button class="btn float-right" @click.prevent="maskMasterPass">
            <i class="fa" :class="masterMasked ? 'fa-eye' : 'fa-eye-slash'" id="mask-button"></i>
          </button>
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <br>
          <input :type="confirmMasked ? 'password' : 'text'" class="form-control float-left w-90" v-model="confirmPassword" placeholder="Confirm Password">
          <button class="btn float-right" @click.prevent="maskConfirmPass">
            <i class="fa" :class="confirmMasked ? 'fa-eye' : 'fa-eye-slash'"></i>
          </button>
        </div>
        <br>
        <br>
        <button type="submit" class="btn btn-primary" @click.prevent="x">Change Master Password</button>
      </form>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  name: 'PasswordManagerSetup',
  data: () => ({
    masterPassword: '',
    confirmPassword: '',
    passwordHint: '',
    oldPassword: '',
    masterMasked: true,
    confirmMasked: true,
    oldMasked: true,
  }),
  methods: {
    ...mapActions(['SetupVault', 'ToggleNav']),
    maskMasterPass() {
      this.masterMasked = !this.masterMasked;
    },
    maskConfirmPass() {
      this.confirmMasked = !this.confirmMasked;
    },
    oldMasterPass() {
      this.masterMasked = !this.masterMasked;
    },
  },
});
</script>

<style scoped>
.container{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding:0;
  width:50%;
}
.card-body{
  padding: 0;
}
form{
  padding: 15px;
}
.w-90{
  width: 92% !important;
}
</style>
