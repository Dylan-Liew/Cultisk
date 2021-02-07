<template>
  <div class="software-updater">
    <Index/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Index from '@/components/SoftwareUpdater/SoftwareIndex.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'SoftwareUpdater',
  components: {
    Index,
  },
});
</script>

<style scoped>

</style>
