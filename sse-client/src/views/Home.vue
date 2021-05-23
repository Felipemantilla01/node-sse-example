<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <div v-if="connectionError">
      <h3 style="color:red"> Connection error with the server </h3>

    </div>
    <div v-if="!connectionError">
      <div v-for="user in users" :key="user.id" class="items-container">
        <div class="item-container">
          <div>
            {{user.firstName}} {{user.lastName}}
          </div>
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
      users: [],
      connectionError: false,
      events: null,
    };
  },
  methods: {
    async handleAdd() {
      const user = {
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
        .schema('user', user, 1)
        .build();

      const newUser = data.user[0];

      try {
        const response = await axios.post(`${urlBase}/users`, {
          ...newUser,
        });
        console.log(response);
      } catch (error) {
        alert(error.message);
        console.log(error);
      }
    },
    handleEvent(event:MessageEvent) {
      const parsedData = JSON.parse(event.data);
      try {
        this.users.push(...parsedData);
        this.users = [];
        this.users.push(...parsedData);
      } catch (error) {
        this.users.push(parsedData);
      }
      console.log(parsedData);
      console.log(typeof parsedData);
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
    this.events = new EventSource(`${urlBase}/events`);
    this.events.onmessage = this.handleEvent.bind(this);
    this.events.onerror = this.handleError.bind(this);
    this.events.onopen = this.handleOpen.bind(this);

    // setInterval(() => {
    //   this.users.push({
    //     name: 'Felipe',
    //   });
    // }, 2000);
  },
  beforeUnmount() {
    this.events.close();
  },
  watch: {
    users(newValue, oldValue) {
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
</style>
