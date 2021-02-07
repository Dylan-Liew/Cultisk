<template>
  <div class="PasswordDetail">
    <p>Password Details Entry</p>
    <p>UUID: {{this.$route.params.uuid}}</p>
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Password Details',
});
</script>
