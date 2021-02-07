<template>
  <div class="home">
    <HomeIndex v-if="isAuthenticated"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import HomeIndex from '@/components/HomeIndex.vue';

const Store = require('electron-store');

export default Vue.extend({
  name: 'Main',
  components: {
    HomeIndex,
  },
  methods: {
    ...mapActions(['SetupOAuth', 'ShowNav']),
  },
  computed: mapGetters(['isAuthenticated', 'GUserID']),
  // TODO: Re enable Authentication Flow after development is done
  // created() {
  //   const store = new Store();
  //   let appID = store.get('appID');
  //   if (!appID) {
  //     const uuid = uuidv4();
  //     store.set('appID', uuid);
  //     appID = uuid;
  //     this.$store.commit('SetAppID', appID);
  //     this.$router.push('/welcome');
  //   } else {
  //     this.$store.dispatch('CheckAppAuthenticated', appID).then(() => {
  //       if (!this.isAuthenticated) {
  //         this.$router.push('/error/oauth');
  //       } else {
  //         this.ShowNav();
  //       }
  //     });
  //   }
  // },
});
</script>

<style scoped>
/*You put CSS that applies to all things rendered in the <router-view>/component*/

</style>
