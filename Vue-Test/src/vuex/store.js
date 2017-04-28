import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showLogin: false
  },
  mutations: {
    SHOW_LOGIN (state) {
      state.showLogin = !state.showLogin
    }
  },
  actions: {
    showLogin ({ commit }) {
      commit('SHOW_LOGIN')
    }
  },
  getters: {
    showState: function (state) {
      return state.showLogin
    }
  }
})
