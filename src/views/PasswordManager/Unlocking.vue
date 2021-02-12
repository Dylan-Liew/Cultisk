<template>
  <div class="password-manager-unlock">
    <p>Unlock your vault please</p>
    <p>Master password</p>
    <input v-model="masterPassword">
    <button @click="unlock">Unlock</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'PasswordManagerUnlock',
  computed: mapGetters(['isUnlocked']),
  data: () => ({
    masterPassword: '',
  }),
  methods: {
    ...mapActions(['UnlockVault']),
    unlock() {
      this.$store.dispatch('UnlockVault', this.masterPassword);
    },
  },
  watch: {
    isUnlocked(newValue) {
      if (newValue) {
        this.$router.push('/password-manager/');
      }
    },
  },
});
</script>

<style>
/*You put CSS that applies to all things rendered in the <router-view>/component*/

</style>
