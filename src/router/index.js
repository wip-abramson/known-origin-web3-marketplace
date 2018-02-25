import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
// import Signup from '@/components/Signup'

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    }
    // ,{
    //   path: '/signup',
    //   name: 'signup',
    //   component: Signup
    // }
  ]
})
