import { createRouter, createWebHistory } from 'vue-router'
import PKIndexView from '../views/PK/PKIndexView'
import RecordIndexView from '../views/Records/RecordsIndexView'
import RankListIndexView from '../views/RankList/RankListIndexView'
import UserBotIndexView from '../views/User/Bots/UserBotsIndexView'
import NotFound from '../views/Error/NotFound'

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/pk/"
  },
  {
    path: "/pk/",
    name: "pk_index",
    component: PKIndexView,
  },
  {
    path: "/record/",
    name: "records_index",
    component: RecordIndexView,
  },
  {
    path: "/ranklist/",
    name: "ranklist_index",
    component: RankListIndexView,
  },
  {
    path: "/user/bot",
    name: "user_bot_index",
    component: UserBotIndexView,
  },
  {
    path: "/404/",
    name: "404",
    component: NotFound,
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

export default router
