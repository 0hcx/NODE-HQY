<template>
    <div class="sidebar">
        <div>
        <el-menu default-active="1" theme="dark">
            <el-submenu index="1">
              <template slot="title">职位功能</template>
              <el-menu-item index="1-1">职位查询</el-menu-item>
              <el-menu-item index="1-2">我的关注</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
    </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  methods: {
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
