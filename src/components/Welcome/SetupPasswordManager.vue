<template>
  <div class="oauth">
    <p>Now we will setup your personal digital vault</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

// TODO: When done move back to Home page, init complete + unhidden nav

export default Vue.extend({
  name: 'PasswordManagerSetup',
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
