<template>
<div class="settings-index">
  <div class="card container">
    <div class="card-body">
      <h5 class="card-header m-0">Cultisk - Change Master Password</h5>
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
        <div class="form-group">
          <label for="Hint">Password Hint</label>
          <br>
          <input type="text" v-model="passwordHint" class="form-control" id="Hint" placeholder="New Password Hint">
        </div>
        <br>
        <button type="submit" class="btn btn-primary" @click.prevent="ChangeMasterPassword">Change Master Password</button>
      </form>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

const { dialog } = require('electron').remote;

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
      this.oldMasked = !this.oldMasked;
    },
    ChangeMasterPassword() {
      this.$store.dispatch('CheckPassword', this.oldPassword).then((r) => {
        if (r) {
          let hint: string | null = this.passwordHint;
          if (hint.length === 0) {
            hint = null;
          }
          if (this.masterPassword === this.confirmPassword) {
            const password = this.masterPassword;
            this.$store.dispatch('ChangeMasterPassword', { password, hint }).then(() => {
              this.ToggleNav();
              this.$router.push('/');
            });
          } else {
            dialog.showMessageBox({
              type: 'warning',
              title: 'New master password do not match',
              message: 'Please check your password and try again.',
            });
            this.passwordHint = '';
            this.confirmPassword = '';
            this.masterPassword = '';
          }
        } else {
          dialog.showMessageBox({
            type: 'warning',
            title: 'Invalid master password',
            message: 'Please check your password and try again.',
          });
          this.oldPassword = '';
        }
      });
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
