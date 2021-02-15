<template>
  <b-modal
    id="modal-prevent-closing"
    ref="modal"
    title="Add Password"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group
        label="Name"
        label-for="name-input"
        invalid-feedback="Name is required"
        :state="nameState"
      >
        <b-form-input
          id="name-input"
          v-model="pname"
          :state="nameState"
          required
        />
      </b-form-group>
      <b-form-group
        label="Username"
        label-for="username-input"
        invalid-feedback="Username is required"
        :state="UsernameState"
      >
        <b-form-input
          id="username-input"
          v-model="username"
          :state="UsernameState"
          required
        />
      </b-form-group>
      <label for="text-password">Password</label>
      <b-form-input class="float-left" style="width:85%;"
        :value="addpassword"
        :type="addPassMasked ? 'password' : 'text'"
        id="text-password" aria-describedby="password-help-block"/>
      <button class="btn float-right p-0 mt-2 mx-1" @click.prevent="x" >
        <i class="fa fa-sync-alt" ></i>
      </button>
      <button class="btn float-right p-0 mt-2 mx-2" @click.prevent="maskAddPass" >
        <i class="fa" :class="addPassMasked ? 'fa-eye' : 'fa-eye-slash'"></i>
      </button>
      <b-form-group
        label="Authenticator Key (TOTP)"
        label-for="totp-input"
        :state="totpState"
      >
        <b-form-input
          id="totp-input"
          v-model="totp"
          :state="totpState"
        />
      </b-form-group>
      <b-form-group
        label="URL"
        label-for="url-input"
        :state="urlState"
      >
        <b-form-input
          id="url-input"
          v-model="url"
          :state="urlState"
        />
      </b-form-group>
    </form>
  </b-modal>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'CreatePasswordModal',
  data: () => ({
    selected: {},
    userPassMasked: true,
    addPassMasked: true,
    pname: '',
    nameState: null,
    username: '',
    UsernameState: null,
    addpassword: '',
    totp: '',
    totpState: null,
    url: '',
    urlState: null,
    passwords: [],
    filterBy: 'all',
  }),
  computed: mapGetters(['selectedPassword', 'allPasswords']),
  methods: {
    ...mapActions(['RetrievePWManagerData', 'getPasswordByUUID', 'FavouriteTogglePWEntry']),
  },
  // created() {
  //   this.RetrievePWManagerData();
  // },
  // watch: {
  //   allPasswords(newValue) {
  //     this.passwords = newValue;
  //   },
  // },
});
</script>

<style scoped>

</style>
