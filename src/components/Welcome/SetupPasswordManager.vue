<template>
  <div class="oauth">
    <div class="card container">
      <div class="card-body">
        <h5 class="card-header m-0">Cultisk - Set Master Password</h5>
        <form>
          <div class="form-group">
            <label for="MasterPassword">Password</label>
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
          <div class="form-group">
            <label for="Hint">Password Hint</label>
            <input type="text" v-model="passwordHint" class="form-control" id="Hint" placeholder="Password Hint">
          </div>
          <button type="submit" class="btn btn-primary" @click.prevent="CreateVault">Create Master Password</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

const { dialog } = require('electron').remote;

// TODO: When done move back to Home page, init complete + unhidden nav
export default Vue.extend({
  name: 'PasswordManagerSetup',
  data: () => ({
    masterPassword: '',
    confirmPassword: '',
    passwordHint: '',
    masterMasked: true,
    confirmMasked: true,
  }),
  methods: {
    ...mapActions(['SetupVault', 'ToggleNav']),
    CreateVault() {
      let hint: string | null = this.passwordHint;
      if (hint.length === 0) {
        hint = null;
      }
      if (this.masterPassword === this.confirmPassword) {
        const password = this.masterPassword;
        this.$store.dispatch('SetupVault', { password, hint }).then(() => {
          this.ToggleNav();
          this.$router.push('/');
        });
      } else {
        dialog.showMessageBox({
          type: 'warning',
          title: 'invalid password',
          message: 'Please check your password and try again.',
        });
        this.passwordHint = '';
        this.confirmPassword = '';
        this.masterPassword = '';
      }
    },
    maskMasterPass() {
      this.masterMasked = !this.masterMasked;
    },
    maskConfirmPass() {
      this.confirmMasked = !this.confirmMasked;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
