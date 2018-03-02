<template>
  <div id="app">
    <div id="header">
      KnownOrigin.io
    </div>

    <div id="content">
      <router-view></router-view>
    </div>

    <div id="footer">
      <p>&copy; 2018 KNOWNORIGIN</p>
      <p>BE ORIGINAL. BUY ORIGINAL.</p>
      <p>(+44) 7715 86 28 33</p>
      <p><a href="mailto:hello@knownorigin.io">hello@knownorigin.io</a></p>
    </div>

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
    color: #2c3e50;
  }

  #content {
    max-width: 600px;
    margin: 0 auto !important;
    float: none !important;
  }

  a {
    color: white;
  }

  #footer, #header {
    background-color: #3e27d9;
    color: white;
  }

  #header {
    min-height: 60px;
    width: 100%;
    font-size: 1.5em;
  }
</style>
