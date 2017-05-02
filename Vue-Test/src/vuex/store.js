import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showLogin: false,
    tab: 'SEARCH'         // 主页TAB
  },
  mutations: {
    SHOW_LOGIN (state) {
      state.showLogin = !state.showLogin
    },
    TOGGLE_TAB (state, tab) {
      state.tab = tab
    }
  },
  actions: {
    showLogin ({ commit }) {
      commit('SHOW_LOGIN')
    },
    toggleTab ({ commit }, tab) {
      commit('TOGGLE_TAB', tab)
    }
  },
  getters: {
    showState: function (state) {
      return state.showLogin
    },
    getTab: function (state) {
      return state.tab
    }
  }
})
