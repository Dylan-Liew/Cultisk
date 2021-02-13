<template>
  <div class="oauth">
    <div class="card container">
      <div class="card-body">
        <h5 class="card-header m-0">Cultisk - Set Master Password</h5>
        <form>
          <div class="form-group">
            <label for="MasterPassword">Password</label>
            <br>
            <input :type="passwordMasked ? 'password' : 'text'" class="form-control float-left mb-2 w-90" v-model="masterPassword" id="MasterPassword" placeholder="Password">
            <button class="btn float-right" v-on:click="masking">
              <i class="fa" :class="passwordMasked ? 'fa-eye' : 'fa-eye-slash'"  id="mask-button"></i>
            </button>
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <br>
            <input :type="passwordMasked2 ? 'password' : 'text'" class="form-control float-left w-90" v-model="confirmPassword" placeholder="Confirm Password">
            <button class="btn float-right" v-on:click="masking2">
              <i class="fa" :class="passwordMasked2 ? 'fa-eye form-control-feedback' : 'fa-eye-slash'"></i>
            </button>
          </div>
          <br>
          <div class="form-group">
            <label for="Hint">Password Hint</label>
            <input type="text" v-model="passwordHint" class="form-control" id="Hint" placeholder="Password Hint">
          </div>
          <button type="submit" class="btn btn-primary" @click="CreateVault">Create Master Password</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

// TODO: When done move back to Home page, init complete + unhidden nav
export default Vue.extend({
  name: 'PasswordManagerSetup',
  data: () => ({
    masterPassword: '',
    confirmPassword: '',
    passwordHint: '',
    passwordMasked: true,
    passwordMasked2: true,
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
        // TODO: Show user alert that password does not match
        this.passwordHint = '';
        this.confirmPassword = '';
        this.masterPassword = '';
      }
    },
    masking() {
      this.passwordMasked = !this.passwordMasked;
    },
    masking2() {
      this.passwordMasked2 = !this.passwordMasked2;
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
