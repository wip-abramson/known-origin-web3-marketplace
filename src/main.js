// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import logging from './logging';
import VModal from 'vue-js-modal';
import AsyncComputed from 'vue-async-computed';

Vue.use(VModal);
Vue.use(AsyncComputed);

Vue.config.productionTip = false

;(async () => {
  try {
    // pre-Vue JS bootstrap
  } catch (e) {
    // eslint-disable-next-line
    console.log(e);
  } finally {
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      store,
      router,
      logging,
      components: {App},
      template: '<App/>'
    });
  }
})();
