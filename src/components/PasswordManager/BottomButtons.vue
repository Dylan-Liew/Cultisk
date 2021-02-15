<template>
  <div class="bottom-buttons" style="width: 80%; margin:10px auto;">
    <b-container v-if="editing">
      <b-row>
        <b-col md="4">
          <button type="button" class="btn btn-danger" @click.prevent="$emit('onCancel')">Cancel</button>
        </b-col>
        <b-col md="4" class="ml-auto text-right">
          <button type="button" class="btn btn-primary" @click.prevent="$emit('onSave')">Save</button>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-else>
      <b-row>
        <b-col md="4">
          <button type="button" class="btn btn-primary" @click.prevent="$emit('onEdit')">Edit</button>
        </b-col>
        <b-col md="4" class="ml-auto text-right">
          <button type="button" class="btn btn-danger" @click.prevent="$emit('onDelete')">Delete</button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'PasswordManagerButtons',
  props: {
    editing: Boolean,
  },
});

</script>

<style scoped>

</style>
