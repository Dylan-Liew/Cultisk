<template>
  <div class="index">
    <!--    Modal that open Upload files, import Upload files component then put inside-->
    <BackupTool/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BackupTool from '@/components/Backup/BackupIndex.vue';

export default Vue.extend({
  name: 'BackupMain',
  components: {
    BackupTool,
  },
});
</script>
