<template>
  <div>
    <Index/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Index from '@/components/EmailFilter/EmailIndex.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'EmailFilter',
  components: {
    Index,
  },
});
</script>

<style scoped>

</style>
