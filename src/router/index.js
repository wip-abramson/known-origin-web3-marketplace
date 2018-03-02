import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Artists from '@/components/Artists'

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/artists',
      name: 'artists',
      component: Artists
    }
    // ,{
    //   path: '/signup',
    //   name: 'signup',
    //   component: Signup
    // }
  ]
})
