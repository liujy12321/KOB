import { createRouter, createWebHistory } from 'vue-router'
import PKIndexView from '../views/PK/PKIndexView'
import RecordIndexView from '../views/Records/RecordsIndexView'
import RankListIndexView from '../views/RankList/RankListIndexView'
import UserBotIndexView from '../views/User/Bots/UserBotsIndexView'
import NotFound from '../views/Error/NotFound'
import UserAccountLoginView from '../views/User/Account/UserAccountLoginView'
import UserAccountRegisterView from '../views/User/Account/UserAccountRegisterView'
/* 是否是在登录状态 */
import store from '../store/index'

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/pk/",
    /* 额外信息：是否需要授权，这里默认除注册，login和404都需要授权 */
    meta: {
      requestAuth: true,
    }
  },
  {
    path: "/pk/",
    name: "pk_index",
    component: PKIndexView,
    meta: {
      requestAuth: true,
    }
  },
  {
    path: "/record/",
    name: "records_index",
    component: RecordIndexView,
    meta: {
      requestAuth: true,
    }
  },
  {
    path: "/ranklist/",
    name: "ranklist_index",
    component: RankListIndexView,
    meta: {
      requestAuth: true,
    }
  },
  {
    path: "/user/bot",
    name: "user_bot_index",
    component: UserBotIndexView,
    meta: {
      requestAuth: true,
    }
  },
  {
    path: "/user/account/login/",
    name: "user_account_login",
    component: UserAccountLoginView,    
    meta: {
      requestAuth: false,
    }
  },
  {
    path: "/user/account/register/",
    name: "user_account_register",
    component: UserAccountRegisterView,
    meta: {
      requestAuth: false,
    }
  },
  {
    path: "/404/",
    name: "404",
    component: NotFound,
    meta: {
      requestAuth: false,
    }
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404/"
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/* 
  实现前端页面的授权：未登录情况下所有页面重定向到注册登录界面
  api: beforeEach
  参数：
    to：跳转到哪个页面
    from：从哪个页面跳转过去的
    next：要不要执行下一步操作
  逻辑：
    如果要去的页面是需要授权的，且当前没登录=>重定向到login页面
    不需要则跳转到默认页面
 */
router.beforeEach((to, from, next) => {
  if (to.meta.requestAuth && !store.state.user.is_login) {
    next({name: "user_account_login"});
  } else {
    next();
  }
})

export default router
