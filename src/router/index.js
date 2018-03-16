import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/pages/Dashboard';
import Artists from '@/components/pages/Artists';
import Details from '@/components/pages/Details';
import Gallery from '@/components/pages/Gallery';
import Account from '@/components/pages/Account';
import License from '@/components/pages/License';
import ConfirmPurchase from '@/components/pages/ConfirmPurchase';
import ArtistPage from '@/components/pages/ArtistPage';
import CompletePurchase from '@/components/pages/CompletePurchase';

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
      path: '/artist/:id',
      name: 'artist',
      component: ArtistPage,
      props: true
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
      path: '/account',
      name: 'account',
      component: Account
    },
    {
      path: '/license',
      name: 'license',
      component: License
    },
    {
      path: '/edition/:edition',
      name: 'confirmPurchase',
      component: ConfirmPurchase,
      props: true
    },
    {
      path: '/edition/:edition/:tokenId',
      name: 'completePurchase',
      component: CompletePurchase,
      props: true
    },
  ]
});
