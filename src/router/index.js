import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Artists from '@/components/Artists'
import Details from '@/components/Details'
import Gallery from '@/components/Gallery'
import PurchaseEdition from '@/components/PurchaseEdition'

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
    },
    {
      path: '/details',
      name: 'details',
      component: Details
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: Gallery
    },
    {
      path: '/purchase/:artist/:edition',
      name: 'purchaseEdition',
      component: PurchaseEdition,
      props: true
    }
  ]
})
