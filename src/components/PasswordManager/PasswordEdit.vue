<template>
  <div class="PasswordEdit">
    <p>Edit password Entry</p>
    <p>UUID: {{this.$route.params.uuid}}</p>
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Password Edit',
});
</script>
