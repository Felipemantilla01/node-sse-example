<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <div v-if="connectionError">
      <h3 style="color:red"> Connection Error </h3>

    </div>
    <div v-if="!connectionError">
      {{facts}}
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Options({
  components: {
    // HelloWorld,
  },
  data() {
    return {
      facts: [],
      connectionError: false,
    };
  },
  methods: {
    handleEvent(event:MessageEvent) {
      const parsedData = JSON.parse(event.data);
      try {
        this.facts.push(...parsedData);
      } catch (error) {
        this.facts.push(parsedData);
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
    const events = new EventSource('http://localhost:3001/events');
    events.onmessage = this.handleEvent.bind(this);
    events.onerror = this.handleError.bind(this);
    events.onopen = this.handleOpen.bind(this);

    // setInterval(() => {
    //   this.facts.push({
    //     name: 'Felipe',
    //   });
    // }, 2000);
  },
  watch: {
    facts(newValue, oldValue) {
      console.log(newValue);
    },
  },
})
export default class Home extends Vue {}
</script>
