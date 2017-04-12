<template>
  <div class="wrapper">
    <div class="topbar">
      <div class="title">前端社团</div>
      <div class="menu">
        <el-menu theme="dark" class="el-menu-demo" mode="horizontal">
          <el-submenu index="1">
            <template slot="title">用户名</template>
            <el-menu-item index="1-1" @click="showUser">退出登录</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="m-bd">
      <button :class="{active: isActive, click: isClick}" @mouseover="over" @mouseout="over" @mousedown="click" @mouseup="click">{{buttonName}}</button>
    </div>
    <div class="msgBox" :class="{showMsg: isShow}"></div>
    <div class="todoList">
      <div v-for="item in todoList" class="item">{{item.name}}</div >
    </div>
  </div>
</template>

<script>

var person = [{
  name: '小王',
  score: 60
}]

export default {
  name: 'sidebar',
  data () {
    return {
      buttonName: '弹出按钮',
      todoList: person,
      isActive: false,
      isClick: false,
      isShow: false
    }
  },
  methods: {
    over () {
      this.isActive = (!this.isActive)
    },
    click () {
      if (!this.isClick) {
        this.isShow = true
      }
      this.isClick = (!this.isClick)
    },
    showUser () {
      alert(sessionStorage.getItem('accessToken'))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .topbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: #324157;
    font-size: 14px;
    color: #bfcbd9;
  }
  .topbar .title {
    height: 60px;
    line-height: 60px;
    margin-left: 10px;
  }

  button {
    padding: .4em .8em; 
    border: 1px solid rgba(0,0,0,.1); 
    background: #58a linear-gradient(hsla(0,0%,100%,.2), transparent); 
    border-radius: .2em; 
    box-shadow: 0 .05em .25em rgba(0,0,0,.5); 
    color: white; 
    text-shadow: 0 -.05em .05em rgba(0,0,0,.5); 
    font-size: 125%; 
    line-height: 1.5;
    cursor: pointer;
    background-color: #6b0;
  }

  .active {
    background-color: #20A0FF;
  }

  .click {
    background-color: red;
  }

  /*msgBox*/
  .msgBox {
    position: absolute;
    width: 300px;
    height: 40px;
    top: 0;
    background: yellowgreen;
    transition: .2s ease;
  }
  .showMsg {
    top: 10px;
    box-shadow: 0 0 0 1px #655;
  }

  .todoList {
    margin-top: 20px;
  }

  .todoList .item {
    box-shadow: 0 0 0 1px #655; 
  }

</style>
