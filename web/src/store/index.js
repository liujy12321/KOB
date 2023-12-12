import { createStore } from 'vuex'
/* 将user加入到全局中 */
import ModuleUser from './user'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user: ModuleUser,
  }
})
