<template>
  
  <div>
    <div>Bot Name: {{ bot_name }}</div>
    <div>Bot Power: {{ bot_power }}</div>
  </div>

  <router-view></router-view>
</template>


<script>
import $ from 'jquery';
import { ref } from 'vue';

export default
{
  name: "App",
  setup: () =>
  {
    let bot_name = ref("");
    let bot_power = ref("");

    $.ajax({
      url: "http://localhost:3000/pk/getBotInfo/",
      type: "get",
      success: resp => {
        bot_name.value = resp.name;
        bot_power.value = resp.power;
      }
    });

    return {
      bot_name,
      bot_power
    }
  }
}
</script>

<style>
body {
  background-image: url("@/assets/background.png");
  background-size: cover;
}
</style>
