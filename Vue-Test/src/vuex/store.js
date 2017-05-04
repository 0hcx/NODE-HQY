import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showLogin: false,
    tab: 'SEARCH',         // 主页TAB
    starCount: 0           // 新关注数量
  },
  mutations: {
    SHOW_LOGIN (state) {
      state.showLogin = !state.showLogin
    },
    TOGGLE_TAB (state, tab) {
      state.tab = tab
    },
    ADD_STAR (state) {
      state.starCount++
    },
    CLEAR_STAR (state) {
      state.starCount = 0
    }
  },
  actions: {
    showLogin ({ commit }) {
      commit('SHOW_LOGIN')
    },
    toggleTab ({ commit }, tab) {
      commit('TOGGLE_TAB', tab)
    },
    showStar ({ commit }, msg) {
      if (msg === 'add') {
        commit('ADD_STAR')
      } else if (msg === 'clear') {
        commit('CLEAR_STAR')
      }
    }
  },
  getters: {
    showState: function (state) {
      return state.showLogin
    },
    getTab: function (state) {
      return state.tab
    },
    getStar: function (state) {
      return state.starCount
    }
  }
})
