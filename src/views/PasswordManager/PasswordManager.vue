<template>
  <div class="password-manager" v-if="isUnlocked">
    <!--Put the side nav here, the thing on the left
    and the list of entries-->
<!--    Modal that open Password Generator, import PasswordGen component then put inside-->
    <router-view/>
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'PasswordManager',
  computed: mapGetters(['isUnlocked']),
});
</script>

<style scoped>
/*You put CSS that applies to all things rendered in the <router-view>/component*/
</style>
