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

<script lang="js">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'PasswordManager',
  computed: mapGetters(['isUnlocked', 'allPasswords', 'allCards']),
  data: () => ({
    passwords: [],
    cards: [],
  }),
  methods: {
    ...mapActions(['RetrievePWManagerData', 'getPasswordByUUID', 'getCardByUUID']),
    getClass: ({ name }) => ({
      'md-primary': name,
    }),
    onSelect(item) {
      if (item.type === 'password') {
        this.$router.push(`/password-manager/password/${item.uuid}?type=password`);
      } else {
        this.$router.push(`/password-manager/card/${item.uuid}?type=card`);
      }
    },
  },
  created() {
    this.RetrievePWManagerData();
  },
  watch: {
    allPasswords(newValue) {
      this.passwords = newValue;
    },
    allCards(newValue) {
      this.cards = newValue;
    },
  },
  beforeRouteUpdate(to, from, next) {
    // called when the route that renders this component has changed.
    // This component being reused (by using an explicit `key`) in the new route or not doesn't change anything.
    // For example, for a route with dynamic params `/foo/:id`, when we
    // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
    // will be reused (unless you provided a `key` to `<router-view>`), and this hook will be called when that happens.
    // has access to `this` component instance.
    const { params } = to;
    if (Object.prototype.hasOwnProperty.call(params, 'uuid') && to.query.type === 'password') {
      this.getPasswordByUUID(params.uuid);
    }
    if (Object.prototype.hasOwnProperty.call(params, 'uuid') && to.query.type === 'card') {
      this.getCardByUUID(params.uuid);
    }
    next();
  },
});
</script>

<style scoped>
/*You put CSS that applies to all things rendered in the <router-view>/component*/
  .p-entries{
    width: 70%;
    margin: auto;
  }

  button:focus{
    outline: none;
    box-shadow: none;
  }
</style>
