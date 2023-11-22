import Vue from 'vue'
import Vuex from 'vuex'
import {
  app,
  user
} from './modules'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user
  },
  state: {
	dynamicTabbar: [] // 动态tabbar
  },
  mutations: {
		updateTabbar(state, payload) {
			state.dynamicTabbar = payload
		}
  },
  actions: {
		changeTabbar({commit}, payload) {
			commit('updateTabbar', payload)
		}
  },
  getters
})
