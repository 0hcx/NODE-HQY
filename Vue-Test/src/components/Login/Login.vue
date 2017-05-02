<template>
  <div class="loginWrapper">
    <div class="hd">
      <h2>前端社团</h2>
      <p>与世界分享你的知识、经验和见解</p>
    </div>
    <div class="bd">
      <el-form :model="loginForm" :rules="loginRule" ref="loginForm">
        <el-form-item prop="userName">
          <el-input type="userName" v-model="loginForm.userName" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input v-model="loginForm.pwd" placeholder="密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')" class="submitBtn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="ft">
      <router-link to="/register">还没有账号？马上注册</router-link>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
import router from '../../router'

export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        userName: '',
        pwd: ''
      },
      loginRule: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            'usr': this.loginForm.userName,
            'pwd': this.loginForm.pwd
          }
          Axios.post('http://localhost:3000/api/login', data)
          .then(res => {
            if (res.data.code === 0) {
              sessionStorage.setItem('accessToken', res.data.access_token)
              sessionStorage.setItem('username', res.data.data.username)
              sessionStorage.setItem('uid', res.data.data._id)
              this.$store.dispatch('showLogin')
              this.$message({
                showClose: true,
                message: '登录成功',
                type: 'success'
              })
              router.push({path: '/p/index', params: { username: res.data.username }})
            } else {
              this.$message({
                showClose: true,
                message: '登录失败，账号或密码错误',
                type: 'error'
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.loginWrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    font-size: 18px;
}

.loginWrapper .hd {
  width: 300px;
}

.loginWrapper .hd h2 {
    font-weight: 400;
    color: #20A0FF;
}

.loginWrapper .hd p {
  font-size: 15px;
  color: #1f2f3d;
}

.loginWrapper .bd {
    width: 300px;
}

.loginWrapper .bd .submitBtn {
  width: 100%;
}

.loginWrapper .bd .el-form-item:last-child {
  margin-bottom: 10px;
}

.loginWrapper .ft {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 300px;
}

.loginWrapper .ft a {
  font-size: 14px;
  text-decoration: none;
  color: #20A0FF;
}
</style>
