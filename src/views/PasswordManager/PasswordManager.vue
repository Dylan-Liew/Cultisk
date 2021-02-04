<template>
  <div class="password-manager">
    <Index/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Index from '@/components/PasswordManager/PasswordIndex.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'Password Manager',
  components: {
    Index,
  },
});
</script>

<style scoped>

</style>
