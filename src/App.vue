<template>
  <div id="app">

    <header id="header" class="centered">
      <router-link :to="{ name: 'account' }" style="float: right">Account</router-link>
      <div class="header-branding"><router-link :to="{ name: 'dashboard' }" class="header-dash">KnownOrigin.io</router-link></div>
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

      <br/>

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
$primary: #3e27d9;
$secondary: #f2f2f2;
$black: black;
$gray: gray;
$white: white;
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
  background-color: $secondary;
  margin: 0;
}

h1 {
  display: block;
  font-size: 38px;
  margin-top: 35px;
  margin-bottom: 35px;
  color: $primary;
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
  line-height: 1.5em;
}

.btn {
  background: $primary;
  color: $secondary;
  font-size: 20px;
  padding: 10px 20px 10px 20px;
  text-decoration: none;
  margin: 5px;

  &:hover {
    text-decoration: none;
  }

  &:disabled {
    background: $gray;
    text-decoration: none;
  }

  &.btn-sold {
    background-color: $sold;
    color: $white;
  }

  &.btn-warning {
    background-color: $warning;
  }

  &.btn-danger {
    background-color: $sold;
  }
}
.router-link-exact-active {
  font-weight: bold;
}

a {
  color: $primary;
}
#header {
  color: $primary;
  padding: 10px;
  margin-bottom: 10px;
}

#footer {
  background-color: $primary;
  color: $secondary;
  padding: 10px;
  padding-bottom: 50px;
  a {
    color: $secondary;
    text-decoration: none;
  }
}

.header-branding {
  font-weight: 600;
  font-style: normal;
  font-size: 34px;
  letter-spacing: 0em;
  line-height: 1em;
  text-transform: none;
  color: $primary;
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

.card {
  background: $white;
  margin-bottom: 2em;
  max-width: 400px;
  a {
    color: $black;
    text-decoration: none;
  }
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

img {
  width: 100%;
  height: auto;
}

.muted {
  color: $gray;
}

.btn-center {
  text-align: center;
}

.header-dash {
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
  color: $secondary;
  padding: 10px;
  opacity: 0.8;
}

.edition-sold {
  position: absolute;
  top: 100px;
  right: 100px;
  background-color: $sold;
  color: $secondary;
  padding: 10px;
  opacity: 0.6;
  font-size: 1.25em;
}

.edition-run {
  background-color: $gray;
  color: $secondary;
  padding: 5px;
}

.error {
  background-color: $sold;
}

strong {
  font-weight: bold;
}

#splash {
  text-align: center;
  color: $white;
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
  background: $white;
  max-width: 400px;
}

</style>
