<template>
  <div class="index">
    <p>Password Manager</p>
    <h3>Testing Axios - Todo list</h3>
    <p>information</p>
    <p>UserID: {{ information.userId }}</p>
    <p>PostID: {{ information.id }}</p>
    <router-link to="/software-updater">Software Updater</router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

export default Vue.extend({
  name: 'PasswordIndex',
  data() {
    return {
      information: null,
    };
  },
  mounted() {
    axios
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .then((response) => {
        this.information = response.data;
        console.log(response);
      });
  },
});

</script>

<style scoped>

</style>
