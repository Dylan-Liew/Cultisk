<template>
  <div class="index">
  </div>
</template>

<style scoped>
.p-entries{
  width: 70%;
  margin: auto;
}
.password-field{
  border: none;
  background: white;
}
button:focus{
  outline: none;
  box-shadow: none;
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TableSingle',
  data: () => ({
    selected: {},
    passwords: [
      {
        uuid: '593bfd33-56d9-45f1-b2cf-2fd297316225',
        name: 'My Google account',
        username: 'test@gmail.com',
        password: 'text',
        url: 'www.google.com',
      },
      {
        uuid: '8eaa423b-2a63-42cb-a977-b38515e85da6',
        name: 'My facebook account',
        username: 'test@gmail.com',
        password: 'text',
        otpSecret: '5567890f',
        url: 'www.facebook.com',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },
      {
        uuid: '386c5d12-2075-454a-abc2-4bd80170fe43',
        name: 'My Online Account',
        username: 'test@gmail.com',
        password: 'mysupersecretpassword',
      },

    ],
  }),
  methods: {
    getClass: ({ wname }) => ({
      'md-primary': wname,
    }),
    onSelect(item) {
      this.selected = item;
    },
    masking() {
      const x = document.getElementById('password');
      if (x.type === 'password') {
        x.type = 'text';
        document.getElementById('mask-button').classList.add('fa-eye-slash');
        document.getElementById('mask-button').classList.remove('fa-eye');
      } else {
        x.type = 'password';
        document.getElementById('mask-button').classList.add('fa-eye');
        document.getElementById('mask-button').classList.remove('fa-eye-slash');
      }
    },
  },
});
</script>
