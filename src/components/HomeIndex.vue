<template>
  <div class="index">
    <br>
    <div class="container shadow-lg p-0">
      <img src="https://res.cloudinary.com/stackrox/v1563842597/kubernetes-security-101-blog-banner.jpg" style="width:100%;">
      <div class="centered header">
        Cultisk
      </div>
      <div class="centered-below header-desc">
        Personal Toolkit to secure your data
      </div>
    </div>
    <br>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

// To programmatically navigate to a new route you can use this.$router.push();
// Documentation is here: https://router.vuejs.org/guide/essentials/navigation.html
export default Vue.extend({
  name: 'HomeIndex',
  data() {
    return {
    };
  },
  methods: {
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  position: relative;
  text-align: center;
  color: white;
}
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.centered-below {
  position: absolute;
  top: 56%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.header{
  font-size: 4em;
  color: white;
}
</style>
