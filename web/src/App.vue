<template>
  
  <NavBar />
  <router-view></router-view>

</template>


<script>
import NavBar from './components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"
import $ from 'jquery'


export default {
  components: {
    NavBar
  },
  /* 使用ajax进行url调试，成功或失败的话看一下回复 */
  setup() {
    $.ajax({
      url: "http://localhost:3000/user/account/token/",
      type: "post",
      data: {
        username: "jimmy",
        password: "password_jimmy",
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      }
    })

    $.ajax({
      url: "http://localhost:3000/user/account/info/",
      type: "get",
      /* 这里需要传入一个header，不需要传数据
      header需要传入到Authorization里
      注意这里Bearer后面有一个空格 */
      headers: {
        Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4MWU1ZGY2MmYzM2Y0MTQ4YjUyMmFlNjQyZTU5Mzc2MiIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTcwMTM5MzU3MiwiZXhwIjoxNzAyNjAzMTcyfQ.1D32dC_vSlqeGWYOVerrFyko9rHzKt4a5JQWAuFpIyI"
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      }
    })

    $.ajax({
      url: "http://localhost:3000/user/account/register/",
      type: "post",
      data: {
        username: "deep",
        password: "password_deep",
        confirmedPassword: "password_deep",
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      }
    })
  }
}
</script>

<style>
body {
  background-image: url("@/assets/images/background.png");
  background-size: cover;
}
</style>
