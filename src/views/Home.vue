<template>
  <div class="home">
    <Index/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Index from '@/components/Index.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'Main',
  components: {
    Index,
  },
});
</script>
