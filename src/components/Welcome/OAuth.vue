<template>
  <div class="oauth">
    <p>Hi nice to meet you.</p>
    <p>We will need you to login to google</p>
    <p>sign in to google button here</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

// TODO: When done move to Setup Password Manager page

export default Vue.extend({
  name: 'oAuthSetup',
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
