<template>
  <div>
    <Index/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Index from '@/components/AntiVirus/AntiVirusIndex.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'AntiVirus',
  components: {
    Index,
  },
});
</script>

<style scoped>

</style>
