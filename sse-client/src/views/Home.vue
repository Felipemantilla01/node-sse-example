<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <div v-if="connectionError">
      <h3 style="color:red"> Connection error with the server </h3>

    </div>
    <div v-if="!connectionError">
      <div v-if="!hideSyncForm">
        <input type="text" v-model="companyUUID">
        <input type="text" v-model="appUUID">
        <button @click="handleStartSync()">start SYNC</button>
      </div>
      <div v-if="hideSyncForm">
        <h5>Sync Started for:</h5>
        <h5>{{'CompanyUUID:' + ' ' + companyUUID + '  |  ' + 'appUUID:' + ' ' + appUUID}}</h5>
      </div>
      <div class="events">
        <div v-for="message in messages" :key="message.id" class="items-container">
        <div class="item-container">
          <div>
            {{message.firstName}} {{message.lastName}}
          </div>
        </div>
      </div>
      <div class="adv-container">

      </div>
      </div>
    </div>

    <div class="add-button-container">
      <div class="fab-button" @click="handleAdd()">
        +
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import mocker from 'mocker-data-generator';
import axios from 'axios';

const urlBase = 'http://localhost:3001';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Options({
  components: {
    // HelloWorld,
  },
  data() {
    return {
      messages: [],
      connectionError: false,
      companyUUID: 'bisovsddqjmtl2w52',
      appUUID: 'bisovsddqjmtl2w5k',
      hideSyncForm: false,
      events:null,
    };
  },
  methods: {
    handleStartSync() {
      this.hideSyncForm = true;
      this.events = new EventSource(`${urlBase}/companies/${this.companyUUID}/apps/${this.appUUID}/events`);
      this.events.onmessage = this.handleEvent.bind(this);
      this.events.onerror = this.handleError.bind(this);
      this.events.onopen = this.handleOpen.bind(this);
    },
    async handleAdd() {
      const message = {
        firstName: {
          faker: 'name.firstName',
        },
        lastName: {
          faker: 'name.lastName',
        },
        country: {
          faker: 'address.country',
        },
        createdAt: {
          faker: 'date.past',
        },
      };

      const data = await mocker()
        .schema('message', message, 1)
        .build();

      const newmessage = data.message[0];

      try {
        const response = await axios.post(`${urlBase}/messages`, {
          ...newmessage,
        });
        console.log(response);
      } catch (error) {
        alert(error.message);
        console.log(error);
      }
    },
    handleEvent(event:MessageEvent) {
      const parsedData = JSON.parse(event.data);
      console.log(parsedData);
    },
    handleError(error:Event) {
      console.log(error);
      this.connectionError = true;
    },
    handleOpen(event:Event) {
      console.log(event);
      this.connectionError = false;
    },
  },
  created() {
    console.log('created');
  },
  beforeUnmount() {
    this.events.close();
  },
  watch: {
    messages(newValue, oldValue) {
      console.log(newValue);
    },
  },
})
export default class Home extends Vue {}
</script>

<style scoped>

.item-container {
  padding: 1vh;
  border-radius: 3vh;
  background-color:rgb(223, 223, 223);
  /* max-width: 30vh; */
  min-width: 30vh;
  margin-top: 1vh;
}

.items-container{
  display: flex;
  justify-content: center;
}

.add-button-container {
  position: fixed;
  bottom: 3vh;
  right: 3vh;
}
.fab-button{
  cursor: pointer;
  font-size: 30px;
  border-radius: 50%;
  min-width: 6vh;
  min-height: 6vh;
  background-color: #42b983;
  display: flex;
  justify-content: center;
  align-items: center;
  color:white;
}

input {
  padding: 1vh;
  border: #42b983 1px solid;
  border-radius: 3vh;
}
button {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 3vh;
  padding:1vh;
}

input:focus {
    outline:none;
}

.events{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.adv-container{
  display: flex;
}
</style>
