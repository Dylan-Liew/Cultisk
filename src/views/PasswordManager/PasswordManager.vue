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
  created() {
    if (!this.isUnlocked) {
      this.$router.push('/password-manager/unlock/');
    }
  },
});
</script>

<style scoped>
/*You put CSS that applies to all things rendered in the <router-view>/component*/
.container{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding:0;
  width:50%;
}
.card-body{
  padding: 0;
}
form{
  padding: 15px;
}
.w-90{
  width: 92% !important;
}
</style>
