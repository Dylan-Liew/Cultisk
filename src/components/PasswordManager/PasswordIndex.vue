<template>
  <div class="index">
    <p>Password Manager</p>
    <div class="todos">
      <div
        @dblclick="onDblClick(todo)"
        v-for="todo in allPasswords"
        :key="todo.id"
        class="todo"
        v-bind:class="{'is-complete':todo.completed}"
      >
        {{ todo.title }}
        <i @click="deleteTodo(todo.id)" class="fas fa-trash-alt"></i>
      </div>
    </div>
    <router-link to="/software-updater">Software Updater</router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default Vue.extend({
  name: 'PasswordIndex',
  methods: {
    ...mapActions(['fetchPasswords', 'deleteTodo', 'updateTodo']),
  },
  computed: mapGetters(['allPasswords']),
  created() {
    this.fetchPasswords();
  },
});

</script>

<style scoped>

</style>
