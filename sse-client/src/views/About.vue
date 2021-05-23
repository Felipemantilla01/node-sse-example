<template>
  <div class="about">
    <div class="refresh-button" @click="loadData()">
      refresh
    </div>

  <div style="border-bottom:#dcdcdc 1px solid; margin-top:2vh; ">
  </div>

  <div>
      {{appInfo}}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      appInfo: null,
    };
  },
  methods: {
    async loadData() {
      const appInfo = await axios.get('http://localhost:3001/data');
      console.log(appInfo);
      this.appInfo = appInfo.data;
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style scoped>
.refresh-button{
  min-width: 20vh;
  border-radius: 3vh;
  background-color:#42b983;
  color: white;
  padding: 1vh;
}

.about{
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
