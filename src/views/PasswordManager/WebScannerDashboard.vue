<template>
  <div class="password-manager-dash" v-if="isUnlocked">
    <!--Put the side nav here, the thing on the left
    and the list of entries-->
    <p>Web scanner</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex'; // @ is an alias to /src

export default Vue.extend({
  name: 'DarkWebScanner',
  computed: mapGetters(['isUnlocked']),
});
</script>

<style scoped>
/*You put CSS that applies to all things rendered in the <router-view>/component*/

</style>
