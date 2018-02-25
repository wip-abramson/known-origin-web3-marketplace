// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import {getDefaultEthWallet, getNetIdString} from './services/web3Service';

Vue.config.productionTip = false

;(async () => {
  try {
    // TODO re-enable
    // const defaultEthWallet = await getDefaultEthWallet();
    // const netIdString = await getNetIdString();
    // store.commit('setNetworkId', netIdString);
    // store.commit('setDefaultEthWallet', defaultEthWallet);
  } catch (e) {
    // eslint-disable-next-line
    console.log(e)
  } finally {
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      store,
      router,
      components: {App},
      template: '<App/>'
    });
  }
})();
