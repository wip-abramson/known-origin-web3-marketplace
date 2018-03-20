<template>
  <div id="app">

    <header id="header" class="centered">
      <router-link :to="{ name: 'account' }" class="pull-right">Account</router-link>
      <div class="header-branding "><router-link :to="{ name: 'dashboard' }" class="header-dash">KnownOrigin.io</router-link></div>
    </header>

    <div class="centered margin-bottom">
      <router-view></router-view>
    </div>

    <footer id="footer" class="centered">
      <current-network style="float: right"></current-network>
      <p>&copy; 2018 KNOWNORIGIN</p>
      <p>BE ORIGINAL. BUY ORIGINAL.</p>
      <!--<p>(+44) 7715 86 28 33</p>-->
      <p><a href="mailto:hello@knownorigin.io">hello@knownorigin.io</a></p>

      <router-link :to="{ name: 'license' }" class="pull-right">License</router-link>
      <router-link :to="{ name: 'details' }" class="pull-right">Contract details</router-link>
    </footer>
  </div>
</template>

<script>
  /* global web3:true */

  import Web3 from 'web3';
  import { mapGetters, mapState } from 'vuex';
  import * as actions from './store/actions';
  import * as mutations from './store/mutation-types';
  import CurrentNetwork from './components/ui-controls/CurrentNetwork';

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
        return;
      }
      if (web3) {
        // Use Mist / MetaMask's / provided provider
        window.web3 = new Web3(web3.currentProvider);

        // Bootstrap the full app
        this.$store.dispatch(actions.INIT_APP);

        // Find current network
        this.$store.dispatch(actions.GET_CURRENT_NETWORK);

      } else {
        // TODO fire action - WEB_3_NOT_FOUND - show error banner
      }
    },
  };
</script>

<style lang="scss">
  h1 {
    display: block;
    font-size: 38px;
    margin-top: 35px;
    margin-bottom: 35px;
    color: #3e27d9;
    border-bottom: 1px;
  }

  h2 {
    display: block;
    font-size: 28px;
    margin-top: 25px;
    margin-bottom: 25px;
  }

  h3 {
    display: block;
    font-size: 16px;
    margin-top: 15px;
    margin-bottom: 15px;
    font-weight: bold;
  }

  p {
    padding: 5px;
    line-height: 1.3;
  }

  .btn {
    background: #3e27d9;
    color: #f2f2f2;
    font-size: 20px;
    padding: 10px 20px 10px 20px;
    text-decoration: none;
    margin: 5px;
  }

  .btn:hover {
    text-decoration: none;
  }

  .btn:disabled {
    background: grey;
    text-decoration: none;
  }

  .router-link-exact-active {
    font-weight: bold;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background-color: #f2f2f2;
    margin: 0;
  }

  a {
    color: #3e27d9;
  }

  #header {
    /*background-color: white;*/
    color: #3e27d9;
    padding: 10px;
    margin-bottom: 10px;
  }

  #footer {
    background-color: #3e27d9;
    color: #f2f2f2;
    padding: 10px;
    padding-bottom: 50px;
  }

  #footer a {
    color: #f2f2f2;
    text-decoration: none;
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

  .centered {
    margin: 0 auto;
    padding: 0 1em;
  }

  .pad-top {
    padding-top: 20px;
  }

  .pad-bottom {
    padding-bottom: 20px;
  }

  .margin-bottom {
    margin-bottom: 150px;
  }

  @media screen and (min-width: 52em) {
    .centered {
      /*max-width: 52em;*/
    }
  }

  /*--------------------------------------------------------------
  Header styles minus menu
  --------------------------------------------------------------*/

  .card {
    background: white;
    margin-bottom: 2em;
    max-width: 400px;
  }

  .card a {
    color: black;
    text-decoration: none;
  }

  .card a:hover {
    /*box-shadow: 3px 3px 8px hsl(0, 0%, 70%);*/
  }

  .card-content {
    padding: 1.4em;
  }

  .card-content h2 {
    margin-top: 0;
    margin-bottom: .5em;
    font-weight: normal;
  }

  .card-content p {
    font-size: 95%;
    padding: 10px;
  }

  img {
    width: 100%;
    height: auto;
  }

  /* Flexbox styles */
  @media screen and (min-width: 40em) {
    .cards {
      margin-top: -1em;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .card {
      margin-bottom: 1em;
      display: flex;
      flex: 0 1 calc(50% - 0.5em);
      /* width: calc(50% - 1em); */
    }
  }

  /* mq 40em*/

  @media screen and (min-width: 60em) {
    .cards {
      margin-top: inherit;
    }

    .card {
      margin-bottom: 2em;
      display: flex;
      flex: 0 1 calc(33% - 0.5em);
      /* width: calc(33% - 1em); */
    }
  }

  /* mq 60em*/

  .muted {
    color: gray;
  }

  .bold {
    font-weight: bold;
  }

  .btn-center {
    text-align: center;
  }

  .pull-right {
    float: right;
    margin: 10px;
  }

  .header-dash {
    text-decoration: none;
  }

  .back-arrow {
    font-size: 1.25em;
    text-decoration: none;
    padding-right: 20px;
  }

  .btn-sold {
    background-color: red;
    color: white;
  }

  .token-id {
    font-weight: bold;
    color: #3e27d9;
    font-size: 1.25em;
  }
</style>
