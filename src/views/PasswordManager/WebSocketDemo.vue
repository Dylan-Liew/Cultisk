<template>
  <div class="websocket-demo">
    <Index/>
  </div>
</template>

<script>
import Vue from 'vue';
import Index from '@/components/WebSocketDemoIndex.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'WebSocketDemo',
  components: {
    Index,
  },
});
</script>

<style scoped>

</style>
