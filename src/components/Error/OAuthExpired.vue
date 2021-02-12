<template>
  <div class="oauth-error">
    <p>OAuth expired, please login again</p>
    <button @click="oauth">Sign in with Google</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

// TODO: When done move back to Home page, authentication complete + unhidden nav
export default Vue.extend({
  name: 'OAuthExpired',
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
        this.$router.push('/');
      }
    },
  },
});

</script>

<style scoped>

</style>
