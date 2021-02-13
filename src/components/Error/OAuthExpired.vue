<template>
  <div class="oauth container w-50">
    <div class="card text-center">
      <h5 class="card-header font-weight-bold">Welcome to Cultisk</h5>
      <div class="card-body m-4">
        <h5 class="card-title">Google Login</h5>
        <p class="card-text text-dark">Token expired.Please login again to proceed.</p>
        <a @click="oauth" class="btn btn-primary text-white">Continue with Google</a>
      </div>
    </div>
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
a:hover{
  text-decoration: none !important;
}
.container{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
