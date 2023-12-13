<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <router-link class="navbar-brand" :to="{name: 'home'}">King of Bots</router-link>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link :class="route_name == 'pk_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'pk_index'}">PK</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="route_name == 'record_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'records_index'}">Records</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="route_name == 'ranklist_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'ranklist_index'}">Rank list</router-link>
        </li>
      </ul>
      <ul class="navbar-nav" v-if="$store.state.user.is_login"> <!-- 登录成功后显示用户名 -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{ $store.state.user.username }}
          </a>
          <ul class="dropdown-menu">
            <li>
                <router-link :class="dropdown-item" :to="{name: 'user_bot_index'}">My bots</router-link>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" @click="logout">Log out</a></li>
          </ul>
        </li>
      </ul>
      <ul class="navbar-nav" v-else> <!-- 添加两个按钮：登录和注册 -->
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'user_account_login'}" href="#" role="button"> <!-- 点击登录可以跳转到页面 -->
            Log in
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'user_account_register'}" href="#" role="button"> <!-- 点击注册可以跳转到页面 -->
            Register
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex';

export default {
    setup() {
      const store = useStore();
        const route = useRoute();
        let route_name = computed (() => route.name)

        const logout = () => {
          store.dispatch("logout");
        }

        return {
            route_name,
            logout
        }
    }
}
</script>

<style scoped>

</style>