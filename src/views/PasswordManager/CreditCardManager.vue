<template>
  <div class="index">
    <b-container class="password-manager position-fixed">
      <b-row>
        <b-col cols="6" style="left:0;">
          <md-table class="p-entries mt-1 mx-auto w-75 test" md-height="100%" v-model="CCards" md-card @md-selected="onSelect" md-fixed-header>
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
                <div v-if="item.favorite" @click="ToggleFavorite(item)" class="fa fa-star float-right checked" ></div>
                <div v-else @click="ToggleFavorite(item)" class="fa fa-star float-right"></div>
                <br>
                {{item.displayMasked}}
              </md-table-cell>
            </md-table-row>
          </md-table>
          <div class="text-center mt-1">
            <b-button variant="primary" @click.prevent="$router.push('/password-manager/cards/card-create')">Add Card</b-button>
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

const { clipboard } = require('electron').remote;

export default Vue.extend({
  name: 'CreditCardManagerIndex',
  data: () => ({
    selected: {},
    CCards: [],
    filterBy: 'all',
  }),
  computed: mapGetters(['selectedCard', 'isUnlocked', 'allCards']),
  methods: {
    ...mapActions(['RetrievePWManagerData', 'getCardByUUID', 'FavouriteToggleCardEntry']),
    getClass: ({ name }) => ({
      'md-primary': name,
    }),
    onSelect(item) {
      if (this.$route.name === 'Card details') {
        this.$router.go(-1);
        this.getCardByUUID(item.uuid);
        this.$router.push(`/password-manager/cards/card/${item.uuid}`);
      } else {
        this.getCardByUUID(item.uuid);
        this.$router.push(`/password-manager/cards/card/${item.uuid}`);
      }
    },
    ToggleFavorite(item) {
      this.FavouriteToggleCardEntry(item);
    },
    CopyToClip(text: string) {
      clipboard.writeText(text);
    },
  },
  created() {
    if (!this.isUnlocked) {
      this.$router.push('/password-manager/unlock/?dest=card');
    } else {
      this.RetrievePWManagerData();
    }
  },
  watch: {
    allCards(newValue) {
      this.CCards = newValue;
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
