<template>
  <div class="index">
    <b-container class="password-manager position-fixed">
      <b-row>
        <b-col cols="6" style="left:0;">
          <md-table class="p-entries mt-1 mx-auto w-75 test" md-height="100%" v-model="passwords" md-card @md-selected="onSelect" md-fixed-header>
            <md-table-toolbar>
              <b-container>
                <b-row>
                  <b-col cols="8">
                    <md-field md-clearable class="md-toolbar-section-start">
                      <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
                    </md-field>
                  </b-col>
                  <b-col cols="4">
                    <div class="md-layout-item">
                      <md-field>
                        <md-select v-model="filterBy">
                          <md-option value="all">All</md-option>
                          <md-option value="favourite">Favourite</md-option>
                        </md-select>
                      </md-field>
                    </div>
                  </b-col>
                </b-row>
              </b-container>
            </md-table-toolbar>
            <md-table-row class="content" slot="md-table-row" :key="item.uuid" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
              <md-table-cell md-sort-by="name">
                <span class="font-weight-bold float-left">{{item.name}}</span>
                <i v-if="item.leaked" class="ml-2 fas fa-exclamation-circle"></i>
                <div v-if="item.favorite" @click="ToggleFavorite(item.uuid)" class="fa fa-star float-right checked" ></div>
                <div v-else @click="ToggleFavorite(item.uuid)" class="fa fa-star float-right"></div>
                <br>
                {{item.username}}
              </md-table-cell>
            </md-table-row>
          </md-table>
          <div class="text-center mt-1">
            <b-button variant="primary" @click.prevent="$router.push('/password-manager/password-create')">Add Password</b-button>
          </div>
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
import { mapGetters, mapActions } from 'vuex';

const toLower = (text: string) => text.toString().toLowerCase();

const searchByName = (items, term: string | null) => {
  if (term !== null) {
    return items.filter((item) => toLower(item.name).includes(toLower(term)));
  }

  return items;
};

export default Vue.extend({
  name: 'PasswordManagerIndex',
  data: () => ({
    userPassMasked: true,
    passwords: [],
    search: '',
    filterBy: 'all',
  }),
  computed: mapGetters(['selectedPassword', 'allPasswords', 'isUnlocked', 'allCards']),
  methods: {
    ...mapActions(['RetrievePWManagerData', 'getPasswordByUUID', 'FavouriteTogglePWEntry']),
    getClass: ({ name }) => ({
      'md-primary': name,
    }),
    onSelect(item) {
      if (this.$route.name === 'Password Details') {
        this.$router.go(-1);
        this.getPasswordByUUID(item.uuid);
        this.$router.push(`/password-manager/password/${item.uuid}`);
      } else {
        this.getPasswordByUUID(item.uuid);
        this.$router.push(`/password-manager/password/${item.uuid}`);
      }
    },
    maskUserPass() {
      this.userPassMasked = !this.userPassMasked;
    },
    ToggleFavorite(uuid: string) {
      this.FavouriteTogglePWEntry(uuid);
    },
    searchOnTable() {
      this.passwords = searchByName(this.allPasswords, this.search);
    },
  },
  created() {
    if (!this.isUnlocked) {
      this.$router.push('/password-manager/unlock/?dest=password');
    } else {
      this.$store.dispatch('RetrievePWManagerData');
    }
  },
  watch: {
    allPasswords(newValue) {
      this.passwords = newValue;
    },
  },
});
</script>

<style lang="scss">
.password-manager .md-table-fixed-header{
  display: none !important;
}
.password-manager .p-entries{
  width: 100%;
  height: 620px;
}
.password-manager .input-field{
  border: none;
  background: white;
}
.password-manager button:focus{
  outline: none;
  box-shadow: none;
}
.password-manager .content{
  height: 100%;
}
.password-manager .checked {
  color: orange;
}
.password-manager .fa:hover{
  opacity: 0.7;
}
.fa-exclamation-circle{
  color: red;
}

</style>
