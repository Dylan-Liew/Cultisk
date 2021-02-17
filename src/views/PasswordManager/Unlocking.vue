<template>
  <div class="password-manager-unlock ">
    <div class="form-container">
      <div class="card">
        <div class="card-body">
          <h5 class="card-header m-0">Cultisk - Unlock Vault</h5>
          <form>
            <div class="form-group">
              <label for="MasterPassword">Password</label>
              <br>
              <input :type="masterMasked ? 'password' : 'text'" class="form-control float-left w-90 mb-2" v-model="masterPassword" id="MasterPassword" placeholder="Password">
              <button class="btn float-right" @click.prevent="maskMasterPass">
                <i class="fa" :class="masterMasked ? 'fa-eye' : 'fa-eye-slash'"  id="mask-button"></i>
              </button>
            </div>
            <button class="btn btn-primary" @click.prevent="unlock">Unlock</button>
            <br>
            <br>
            <button class="btn btn-primary" @click.prevent="retrievePasswordHint">Get password Hint</button>
          </form>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

const { dialog } = require('electron').remote;

export default Vue.extend({
  name: 'PasswordManagerUnlock',
  computed: mapGetters(['isUnlocked']),
  data: () => ({
    masterPassword: '',
    masterMasked: true,
  }),
  methods: {
    ...mapActions(['UnlockVault', 'RetrievePWHint']),
    unlock() {
      this.$store.dispatch('UnlockVault', this.masterPassword).then(() => {
        if (this.isUnlocked) {
          if (this.$route.query.dest === 'password') {
            this.$router.push('/password-manager/');
          } else {
            this.$router.push('/password-manager/cards');
          }
        } else {
          dialog.showMessageBox({
            type: 'warning',
            title: 'invalid password',
            message: 'Please check your password and try again.',
          });
          this.masterPassword = '';
        }
      });
    },
    maskMasterPass() {
      this.masterMasked = !this.masterMasked;
    },
    retrievePasswordHint() {
      this.$store.dispatch('RetrieveHint').then((x) => {
        if (x.length !== 0) {
          dialog.showMessageBox({
            title: 'Your master password Hint',
            message: `The hint for your master password is ${x}`,
          });
        } else {
          dialog.showMessageBox({
            title: 'Your master password Hint',
            message: 'You did not set a hint for your master password.',
          });
        }
      });
    },
  },
});
</script>

<style scoped>
/*You put CSS that applies to all things rendered in the <router-view>/component*/

.form-container{
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
}
.card-body{
  padding: 0 !important;
}
form{
  padding: 15px;
}
.w-90{
  width: 92.5% !important;
}
.forget-password:hover{
  text-decoration: underline;
}
.container{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding:0;
  width:50%;
}
.card-body{
  padding: 0;
}
form{
  padding: 15px;
}

</style>
