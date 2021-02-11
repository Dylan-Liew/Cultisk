<template>
  <div class="index">
    <b-container class="position-fixed">
        <b-row>
          <b-col cols="4" >
              <md-table class="e-entries ml-4 mt-2" md-height="590px" style="height:650px" v-model="emails" md-card @md-selected="onSelect" md-fixed-header>
              <md-table-row class="content" slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
                <md-table-cell md-label="Filtered Email" md-sort-by="id">
                    <span class="font-weight-bold" style="font-size:1.1em;">{{item.sender}}</span>
                    <button type="button" class="btn btn-danger btn-sm float-right mt-2">Untrash</button>
                    <br>
                  <span class="font-weight-bold">{{item.subject}}</span>
                    <br>
                    <span class="font-weight-normal">{{item.message.slice(0, 25)+'...'}}</span>
                </md-table-cell>
              </md-table-row>
            </md-table>
          </b-col>
          <b-col cols="8">
            <div class="card email-details" style="width: 90%; margin:100px auto;">
              <div class="card-header">
                Item Information
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><span class="font-weight-bold">Sender:</span><br>{{ selected.sender }}</li>
                <li class="list-group-item"><span class="font-weight-bold">Subject:</span><br>{{ selected.subject }}</li>
                <li class="list-group-item"><span class="font-weight-bold">
                  Message:</span><br>
                  <textarea v-model="selected.message" style="height:300px; width:100%;" disabled></textarea>
                </li>
              </ul>
            </div>
          </b-col>
        </b-row>
    </b-container>
  </div>
</template>

<style scoped>
.e-entries{
  width: 100%;
  margin: auto;
  padding: 0px;
}
button:focus{
  outline: none;
  box-shadow: none;
}
.email-details{
  margin: 0;
  position: absolute;
  top: 35%;
  left: 55%;
  transform: translate(-50%, -50%);
}
.md-label{
  font-size:2em;
  color: black;
  font-weight: bold;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'EmailIndex',
  data: () => ({
    selected: {},
    emails: [
      {
        sender: 'testuser@gmail.com',
        subject: 'hows life',
        message: 'be careful of corona virus'
          + 'dsadddddddddddddsasdsadsadsadsdasd'
          + 'asdsadsadsadsasadsaddasdsadasdsad'
          + 'asdsadsadsadsdsadsa',
      },
      {
        sender: 'testuser1@gmail.com',
        subject: 'bruh',
        message: 'corona 2',
      },
      {
        sender: 'testuser3@gmail.com',
        subject: 'life good',
        message: 'be careful of corona virus2',
      },
    ],
  }),
  methods: {
    ...mapActions(['RetrieveSpamFilterInfo']),
    getClass: ({ subject }) => ({
      'md-primary': subject,
    }),
    onSelect(item) {
      this.selected = item;
    },
  },
  computed: mapGetters(['allEmails']),
});
</script>
