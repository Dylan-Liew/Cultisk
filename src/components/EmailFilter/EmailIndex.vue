<template>
  <div class="index">
    <b-container class="position-fixed">
        <b-row>
          <b-col cols="6" >
              <md-table class="p-entries mt-2" md-height="590px" style="height:650px" v-model="emails" md-card @md-selected="onSelect" md-fixed-header>
              <md-table-row class="content" slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
                <md-table-cell md-label="Email Filtered" md-sort-by="id">
                    <span class="font-weight-bold">{{item.subject}}</span>
                    <button type="button" class="btn btn-danger float-right mt-2">Untrash</button>
                    <br>
                    <span class="font-weight-bold">Sender:</span> {{item.sender}}
                    <br>
                    <span class="font-weight-bold">Message</span> {{item.message.slice(0, 10) + '......'}}
                </md-table-cell>
              </md-table-row>
            </md-table>
          </b-col>
          <b-col cols="6">
            <div class="card" style="width: 90%; margin:100px auto;">
              <div class="card-header">
                Item Information
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><span class="font-weight-bold">Subject:</span><br>{{ selected.subject }}</li>
                <li class="list-group-item"><span class="font-weight-bold">Sender:</span><br>{{ selected.sender }}</li>
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
.p-entries{
  width: 70%;
  margin: auto;
}
button:focus{
  outline: none;
  box-shadow: none;
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'EmailIndex',
  data: () => ({
    selected: {},
    emails: [
      {
        sender: 'testuser@gmail.com',
        subject: 'hows life',
        message: 'be careful of corona virus',
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
    getClass: ({ subject }) => ({
      'md-primary': subject,
    }),
    onSelect(item) {
      this.selected = item;
    },
  },
});
</script>
