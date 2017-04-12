import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios'
import Login from '@/components/login'
import Register from '@/components/register'
import Wrapper from '@/components/wrapper'
import Sidebar from '@/components/sidebar'
import LoadDemo from '@/components/loadDemo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/p/:id',
      component: Wrapper,
      children: [
        {
          path: '/p/sidebar',
          name: 'Sidebar',
          component: Sidebar
        },
        {
          path: '/p/loadDemo',
          name: 'LoadDemo',
          component: LoadDemo
        }
      ],
      beforeEnter: (to, from, next) => {
        let pattern = /^(\/p)/g
        let token = sessionStorage.getItem('accessToken')
        if (pattern.test(to.path)) {
          Axios.post('http://localhost:3000/api/isLogin', {access_token: token})
          .then(res => {
            if (res.data.code === 0) {
              next()
            } else {
              next({name: 'Login'})
            }
          })
          .catch(err => {
            console.log(err)
          })
        }
      }
    }
  ]
})

