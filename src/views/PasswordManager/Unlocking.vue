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
            <button type="submit" class="btn btn-primary" @click="unlock">Unlock</button>
          </form>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'PasswordManagerUnlock',
  computed: mapGetters(['isUnlocked']),
  data: () => ({
    masterPassword: '',
    masterMasked: true,
  }),
  methods: {
    ...mapActions(['UnlockVault']),
    unlock() {
      this.$store.dispatch('UnlockVault', this.masterPassword);
    },
    maskMasterPass() {
      this.masterMasked = !this.masterMasked;
    },
  },
  watch: {
    isUnlocked(newValue) {
      if (newValue) {
        this.$router.push('/password-manager/');
      }
    },
  },
});
</script>

<style>
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
  width: 92% !important;
}
</style>
