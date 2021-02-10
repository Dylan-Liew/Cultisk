<template>
  <div class="PasswordDetail">
    <div class="card" style="width: 50%; margin:100px auto;">
      <div class="card-header">
        Item Information
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><span class="font-weight-bold">Account Name:</span><br>{{ selected.name }}</li>
        <li class="list-group-item"><span class="font-weight-bold">Username:</span><br>{{ selected.username }}</li>
        <li class="list-group-item"><span class="font-weight-bold">UUID:</span><br>{{this.$route.params.uuid}}</li>
        <li class="list-group-item"><span class="font-weight-bold">
          Password:</span><br>
          <input class="password-field float-left" type="password" :value="selected.password" id="password" disabled>
          <button class="btn float-right" v-on:click="masking"><i class="fa fa-eye" id="mask-button"></i></button>
        </li>
        <li class="list-group-item" v-if="selected.url">
          <span class="font-weight-bold">URL:</span>
          <br>{{ selected.url }}
        </li>
        <li class="list-group-item" v-if="selected.otpSecret"><span class="font-weight-bold">TOTP secret:</span>
          <br>{{ selected.otpSecret }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PasswordDetails',
  data() {
    return (
      {
        selected: {
          uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
          name: 'My Online Account',
          username: 'test@gmail.com',
          password: 'mysupersecretpassword',
        },
      }
    );
  },
  // Magic to get Decrypted info from getter based on UUID
});
</script>
