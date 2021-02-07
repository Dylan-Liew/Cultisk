<template>
  <div class="password-manager" v-if="isUnlocked">
    <!--Put the side nav here, the thing on the left
    and the list of entries-->
    <p>Side nav and entry list here</p>
    <p>The entry list change based on the thing selected on the sidenav</p>
    <p>This can be done by switching the data set, all/favourite,password,cards</p>
    <p>The router view, shows the selected entry details/edit/delete option & create</p>
<!--    Modal that open Password Generator, import PasswordGen component then put inside-->
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex'; // @ is an alias to /src

export default Vue.extend({
  name: 'Password Manager',
  computed: mapGetters(['isUnlocked']),
});
</script>

<style scoped>
/*You put CSS that applies to all things rendered in the <router-view>/component*/

</style>
