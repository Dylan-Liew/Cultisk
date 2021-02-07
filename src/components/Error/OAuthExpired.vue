<template>
  <div class="oauth-error">
    <p>OAuth expired, please login again</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

// TODO: When done move back to Home page, authentication complete + unhidden nav
export default Vue.extend({
  name: 'OAuthExpired',
});

</script>

<style scoped>

</style>
