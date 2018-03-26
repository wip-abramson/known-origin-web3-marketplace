<template>
  <div id="app">

    <header id="header" class="centered">
      <router-link :to="{ name: 'account' }" style="float: right" class="no-text-decoration">Account</router-link>
      <div class="header-branding">
        <router-link :to="{ name: 'dashboard' }" class="no-text-decoration">KnownOrigin.io</router-link>
      </div>
    </header>

    <modal name="no-web3-found" :height="400" :clickToClose="false">
      <div class="no-web3-found-container">
        <div>
          <h1>No web3 provider found!</h1>

          <p>
            You need to install <a href='https://metmask.io' target="_blank">MetaMask </a> to use this feature. <a
            href='https://metmask.io' target="_blank">https://metamask.io</a>
          </p>
        </div>
        <div>
          <img src="../static/pay_with_metamask.png"/>
        </div>
      </div>
    </modal>

    <div class="centered margin-bottom">
      <router-view></router-view>
    </div>

    <footer id="footer" class="centered">
      <current-network style="float: right"></current-network>
      <p>&copy; 2018 KNOWNORIGIN</p>
      <p>BE ORIGINAL. BUY ORIGINAL.</p>
      <!--<p>(+44) 7715 86 28 33</p>-->
      <p><a href="mailto:hello@knownorigin.io">hello@knownorigin.io</a></p>

      <br/>

      <router-link :to="{ name: 'license' }">License</router-link> |
      <router-link :to="{ name: 'details' }">Contract details</router-link> |
      <router-link :to="{ name: 'assets' }">Assets</router-link>
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
    mounted () {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 === 'undefined') {
        console.log('No web3? You should consider trying MetaMask!');
        this.$modal.show('no-web3-found');
        return;
      }

      if (web3) {
        // Use Mist / MetaMask's / provided provider
        window.web3 = new Web3(web3.currentProvider);

        // Bootstrap the full app
        this.$store.dispatch(actions.INIT_APP);

        // Find current network
        this.$store.dispatch(actions.GET_CURRENT_NETWORK);

      }
    },
  };
</script>

<style lang="scss">

  $primary: #3d3bee;
  $background: #f0f0ff;

  $success: #2ed573;

  $strong-text: #4f4f6f;
  $normal-text: #757587;

  $font_family_1: 'Avenir', Helvetica, Arial, sans-serif;

  $sold: red;
  $warning: darkorange;

  /*--------------------------------------------------------------
    Header styles minus menu
    --------------------------------------------------------------*/
  /* Flexbox styles */
  /* mq 40em*/
  /* mq 60em*/

  #app {
    font-family: $font_family_1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: $background;
    margin: 0;
  }

  h1 {
    display: block;
    font-size: 28px;
    margin-top: 35px;
    margin-bottom: 35px;
    color: $strong-text;
    border-bottom: 1px;
  }

  h2 {
    display: block;
    font-size: 28px;
    margin-top: 25px;
    margin-bottom: 25px;
    color: $strong-text;
  }

  h3 {
    display: block;
    font-size: 16px;
    margin-top: 15px;
    margin-bottom: 15px;
    font-weight: bold;
    color: $strong-text;
  }

  p {
    font-size: 14px;
    padding: 5px;
    line-height: 1.5em;
    color: $normal-text;
  }

  hr {
    margin: 25px;
  }

  a {
    color: $primary;
  }

  img {
    width: 100%;
    height: auto;
  }

  strong {
    font-weight: bold;
  }

  .btn {
    background: $primary;
    color: $background;
    font-size: 20px;
    padding: 10px 20px 10px 20px;
    text-decoration: none;
    margin: 5px;

    &:hover {
      text-decoration: none;
    }

    &:disabled {
      background: $normal-text;
      text-decoration: none;
    }

    &.btn-sold {
      color: $sold;
    }

    &.btn-warning {
      background-color: $warning;
    }

    &.btn-danger {
      background-color: $sold;
    }

    &.btn-success {
      background-color: $success;
    }
  }

  #header {
    color: $primary;
    padding: 10px;
    margin-bottom: 10px;

    .header-branding {
      font-weight: 600;
      font-style: normal;
      font-size: 34px;
      letter-spacing: 0em;
      line-height: 1em;
      text-transform: none;
      color: $primary;
    }
  }

  #footer {
    background-color: $primary;
    color: $background;
    padding: 10px;
    padding-bottom: 50px;

    a {
      color: $background;
      text-decoration: none;
    }

    p {
      color: $background;
    }
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

  .muted {
    color: $normal-text;
  }

  .btn-center {
    text-align: center;
  }

  .no-text-decoration {
    text-decoration: none;
  }

  .back-arrow {
    font-size: 1.25em;
    text-decoration: none;
    padding-right: 20px;
  }

  .token-id {
    font-weight: bold;
    color: $primary;
    font-size: 1.25em;
  }

  .card {
    background: $background;
    margin-bottom: 2em;
    max-width: 400px;
  }

  .card-content {
    padding: 1.4em;
    h2 {
      margin-top: 0;
      margin-bottom: .5em;
      font-weight: normal;
    }
    p {
      font-size: 95%;
      padding: 10px;
    }
  }

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
    }
  }

  @media screen and (min-width: 60em) {
    .cards {
      margin-top: inherit;
    }
    .card {
      margin-bottom: 2em;
      display: flex;
      flex: 0 1 calc(33% - 0.5em);
    }
  }

  .thumbnail {
    position: relative;
  }

  .edition-type {
    position: absolute;
    top: 0;
    left: 0;
    background-color: $primary;
    color: $background;
    padding: 10px;
    opacity: 0.8;
  }

  .edition-sold {
    position: absolute;
    top: 100px;
    right: 100px;
    background-color: $sold;
    color: $background;
    padding: 10px;
    opacity: 0.9;
    font-size: 1.25em;
  }

  .edition-sold-out {
    position: absolute;
    top: 0px;
    right: 0px;
    background-color: $sold;
    color: $background;
    padding: 10px;
    opacity: 0.6;
    font-size: 1.25em;
  }

  .edition-run {
    background-color: $normal-text;
    color: $background;
    padding: 5px;
  }

  #splash {
    text-align: center;
    background-image: url('../static/background.jpg');
    min-height: 300px;

    .strap {
      margin: 50px;
      padding-top: 100px;
      font-size: 3em;
      line-height: 1.5em;
    }
  }

  .assets_to_buy {
    background-color: $background;
    max-width: 400px;
  }

  .no-web3-found-container {
    padding: 20px;
    font-size: 30px;
    color: red;
    height: 400px;
  }

</style>
