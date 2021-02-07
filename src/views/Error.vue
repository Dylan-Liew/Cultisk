<template>
  <div class="error">
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

// TODO: When done move back to Home page, authentication complete + unhidden nav
export default Vue.extend({
  name: 'Error',
});

</script>

<style scoped>
  p {
    color: white;
  }
/*You put css that applies ALL the components rendered in this view*/
</style>
