<template>
  <div class="index">
    <h1>Cultisk</h1>
    <p v-if="isAuthenticated">
      Authentication Done
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { mapActions, mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Index',
  methods: {
    ...mapActions(['SetupApp', 'CheckAppAuthenticated']),
  },
  computed: mapGetters(['isAuthenticated', 'GUserID']),
  created() {
    let AppID = localStorage.getItem('AppID');
    if (AppID === null) {
      const uuid = uuidv4();
      localStorage.setItem('AppID', uuid);
      AppID = uuid;
      this.SetupApp(AppID);
    } else {
      this.CheckAppAuthenticated(AppID);
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
