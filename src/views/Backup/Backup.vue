<template>
  <div>
    <Index/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Index from '@/components/Backup/BackupIndex.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'Backup',
  components: {
    Index,
  },
});
</script>

<style scoped>

</style>
