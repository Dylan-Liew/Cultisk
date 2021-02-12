<template>
  <div class="oauth">
    <p>Hi nice to meet you.</p>
    <p>We will need you to login to google</p>
    <p>sign in to google button here</p>
    <button @click="oauth">Sign in with Google</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

// TODO: When done move to Setup Password Manager page

export default Vue.extend({
  name: 'oAuthSetup',
  computed: mapGetters(['appID', 'isAuthenticated', 'timeout']),
  methods: {
    ...mapActions(['SetupOAuth']),
    oauth() {
      this.$store.dispatch('SetupOAuth', this.appID);
    },
  },
  watch: {
    isAuthenticated(newValue) {
      if (newValue) {
        this.$router.push('/welcome/password-manager');
      }
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
