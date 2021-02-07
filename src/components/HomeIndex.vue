<template>
  <div class="index">
    <h1>Cultisk</h1>
    <p>Home Page for user after authentication</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

// To programmatically navigate to a new route you can use this.$router.push();
// Documentation is here: https://router.vuejs.org/guide/essentials/navigation.html
export default Vue.extend({
  name: 'HomeIndex',
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
