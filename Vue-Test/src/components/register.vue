<template>
  <div class="loginWrapper">
    <div class="hd">
      <h2>前端社团</h2>
      <p>与世界分享你的知识、经验和见解</p>
    </div>
    <div class="bd">
      <el-form :model="registerForm" :rules="registerRule" ref="registerForm">
        <el-form-item prop="userName">
          <el-input type="userName" v-model="registerForm.userName" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input v-model="registerForm.pwd" placeholder="密码" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="checkPwd">
          <el-input v-model="registerForm.checkPwd" placeholder="请再次输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('registerForm')" class="submitBtn">立即注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="ft">
      <router-link to="/">已经有账号？马上登录</router-link>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
import router from '../router'

export default {
  name: 'register',
  data () {
    var validateUser = (rule, value, cb) => {
      var pattern = /^[\w\u4e00-\u9fa5]{3,10}$/g
      if (value === '') {
        cb(new Error('请输入用户名'))
      } else if (!pattern.test(value)) {
        cb(new Error('请输入3-10个字母/汉字/数字/下划线'))
      } else {
        cb()
      }
    }
    var validatePwd = (rule, value, cb) => {
      var pattern = /^\S{3,20}$/g
      if (value === '') {
        cb(new Error('请输入密码'))
      } else if (!pattern.test(value)) {
        cb(new Error('请输入3-20个非空白字符'))
      } else {
        if (this.registerForm.checkPwd !== '') {
          this.$refs.registerForm.validateField('checkPwd')
        }
        cb()
      }
    }
    var validateCheckPwd = (rule, value, cb) => {
      if (value === '') {
        cb(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.pwd) {
        cb(new Error('两次输入密码不一致!'))
      } else {
        cb()
      }
    }
    return {
      registerForm: {
        userName: '',
        pwd: '',
        checkPwd: ''
      },
      registerRule: {
        userName: [
        { validator: validateUser, trigger: 'blur' }
        ],
        pwd: [
        { validator: validatePwd, trigger: 'blur' }
        ],
        checkPwd: [
        { validator: validateCheckPwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            'usr': this.registerForm.userName,
            'pwd': this.registerForm.pwd
          }
          Axios.post('http://localhost:3000/register', data)
          .then(res => {
            console.log(res.data)
            if (res.data.code === 0) {
              this.$message({
                showClose: true,
                message: '注册成功',
                type: 'success'
              })
              router.push({name: 'Login'})
            } else {
              this.$message({
                showClose: true,
                message: '注册失败',
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
