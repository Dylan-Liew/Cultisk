<template>
  <div class="oauth container w-50">
    <div class="card text-center">
      <h5 class="card-header font-weight-bold">Welcome to Cultisk</h5>
      <div class="card-body m-4">
        <h5 class="card-title">Google Login</h5>
        <p class="card-text text-dark">Click on the button below to login with Google to proceed.</p>
        <a @click="oauth" class="btn btn-primary text-white">Continue with Google</a>
      </div>
    </div>
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
