<template>
  <div class="oauth">
    <p>Now we will setup your personal digital vault</p>
    <p>Your password</p>
    <input v-model="masterPassword">
    <p>Confirm your password</p>
    <input v-model="confirmPassword">
    <p>Password hint</p>
    <input v-model="passwordHint">
    <button @click="CreateVault">Create Vault</button>
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
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
