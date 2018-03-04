<template>
  <div id="app">
    <div id="header" class="header-branding">
      KnownOrigin.io <current-network></current-network>
    </div>

    <span style="float: right"><router-link :to="{ name: 'account' }">Account</router-link></span>

    <div id="content">
      <router-view></router-view>
    </div>

    <div id="links">
      <router-link :to="{ name: 'dashboard' }">Dash</router-link> |
      <router-link :to="{ name: 'artists' }">Artists</router-link> |
      <router-link :to="{ name: 'gallery' }">Gallery</router-link> |
      <router-link :to="{ name: 'details' }">Contract details</router-link>
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
  import {mapGetters, mapState} from 'vuex'
  import * as actions from './store/actions'
  import * as mutations from './store/mutation-types'
  import CurrentNetwork from './components/CurrentNetwork'

  export default {
    name: 'app',
    components: {CurrentNetwork},
    computed: {
      ...mapGetters([]),
      ...mapState([]),
    },
    mounted() {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 === 'undefined') {
        console.error('No web3 detected...');
        return
      }
      if (web3) {
        // Use Mist / MetaMask's / provided provider
        window.web3 = new Web3(web3.currentProvider);

        // Bootstrap the full app
        this.$store.dispatch(actions.INIT_APP);

        // Find current network
        this.$store.dispatch(actions.GET_CURRENT_NETOWKR);

      } else {
        // TODO fire action - WEB_3_NOT_FOUND - show error banner
      }
    },
  }
</script>

<style>
  h1 {
    display: block;
    font-size: 38px;
  }

  h2 {
    display: block;
    font-size: 24px;
  }

  .btn {
    background: #3e27d9;
    color: #f2f2f2;
    font-size: 20px;
    padding: 10px 20px 10px 20px;
    text-decoration: none;
  }

  .btn:hover {
    background: #3e27d9;
    text-decoration: none;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    max-width: 600px;
    margin: 0 auto !important;
    float: none !important;
    background-color: #f2f2f2;
  }

  #content {
    margin: 20px;
  }

  a {
    color: #3e27d9;
  }

  #header {
    background-color: white;
    color: #3e27d9;
    padding: 10px;
  }

  #footer {
    background-color: #3e27d9;
    color: #f2f2f2;;
    padding: 10px;
  }

  #footer a {
    color: #f2f2f2;
  }

  .header-branding {
    font-weight: 600;
    font-style: normal;
    font-size: 34px;
    letter-spacing: 0em;
    line-height: 1em;
    text-transform: none;
    color: #3e27d9;
  }

</style>
