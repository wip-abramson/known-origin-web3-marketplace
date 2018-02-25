<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view></router-view>
  </div>
</template>

<script>
  /* global web3:true */

  import Web3 from 'web3'
  import Eth from "ethjs";
  import {mapGetters} from 'vuex'
  import * as actions from './store/actions'

  export default {
    name: 'app',
    computed: {
      ...mapGetters([])
    },
    mounted() {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 === 'undefined') {
        console.error('No web3 detected...');
        return
      }
      this.$store.dispatch(actions.INIT_ETHJS);
    },
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
