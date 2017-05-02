<template>
    <div class="sidebar">
        <div>
        <el-menu default-active="1" theme="dark">
            <el-submenu index="1">
              <template slot="title">职位功能</template>
              <el-menu-item index="1-1" @click="toggleTab('SEARCH')">职位查询</el-menu-item>
              <el-menu-item index="1-2" @click="toggleTab('STAR')">我的关注</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
    </div>
</template>

<script>
// import Axios from 'axios'
// import { mapActions } from 'vuex'

export default {
  data () {
    return {
    }
  },
  methods: {
    // ...mapActions({
    //   toggleTab: 'toggleTab'
    // }),
    toggleTab (tab) {
      // var data = {
      //   uid: sessionStorage.getItem('uid')
      // }
      // Axios.post('http://localhost:3000/api/getStarJob', data)
      //   .then(res => {
      //     console.log(res.data)
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
      this.$store.dispatch('toggleTab', tab)
      this.$emit('toggleTab')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sidebar {
    width: 140px;
    padding-bottom: 100%;
    background-color: #333744;
}
</style>
