import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showLogin: false,
    tab: 'SEARCH',         // 主页TAB
    starCount: 0,          // 新关注数量
    updateStar: true,
    searchJobs: {
      data: [],
      pageCount: 0
    },
    starJobs: {
      data: [],
      pageCount: 0
    }
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
    },
    UPDATE_STAR (state) {
      state.updateStar = !state.updateStar
    },
    UPDATE_SEARCH_JOBS (state, data) {
      state.searchJobs = data
    },
    UPDATE_STAR_JOBS (state, data) {
      state.starJobs = data
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
    },
    updateStar ({ commit }) {
      commit('UPDATE_STAR')
    },
    updateSearchJobs ({ commit }, data) {
      commit('UPDATE_SEARCH_JOBS', data)
    },
    updateStarJobs ({ commit }, data) {
      commit('UPDATE_STAR_JOBS', data)
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
    },
    getUpdateStar: function (state) {
      return state.updateStar
    },
    getSearchJobs: function (state) {
      return state.searchJobs
    },
    getStarJobs: function (state) {
      return state.starJobs
    }
  }
})
