<template>
  <div class="password-manager" v-if="isUnlocked">
    <!--Put the side nav here, the thing on the left
    and the list of entries-->
<!--    Modal that open Password Generator, import PasswordGen component then put inside-->
    <b-container class="position-fixed">
      <b-row>
        <b-col cols="6" >
          <md-table class="p-entries mt-2" md-height="590px" v-model="passwords" md-card @md-selected="onSelect" md-fixed-header>
            <md-table-row class="content" slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
              <md-table-cell md-label="Passwords Manager" md-sort-by="id">
                  <span class="font-weight-bold">{{item.name}}</span><br>
                  {{item.username}}
              </md-table-cell>
            </md-table-row>
          </md-table>
        </b-col>
        <b-col cols="6">
          <router-view/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex'; // @ is an alias to /src

export default Vue.extend({
  name: 'Password Manager',
  computed: mapGetters(['isUnlocked']),
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
      this.$router.push(`/password-manager/password/${item.uuid}`);
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

<style scoped>
/*You put CSS that applies to all things rendered in the <router-view>/component*/
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
