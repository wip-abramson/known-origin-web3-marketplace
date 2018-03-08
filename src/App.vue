<template>
  <div id="app">
    <div id="header" class="header-branding">
      KnownOrigin.io
      <current-network></current-network>
    </div>

    <span style="float: right"><router-link :to="{ name: 'account' }">Account</router-link></span>

    <div id="content">
      <router-view></router-view>
    </div>

    <div id="links">
      <router-link :to="{ name: 'dashboard' }">Dash</router-link>
      |
      <router-link :to="{ name: 'artists' }">Artists</router-link>
      |
      <router-link :to="{ name: 'gallery' }">Gallery</router-link>
      |
      <router-link :to="{ name: 'license' }">License</router-link>
      |
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
  import { mapGetters, mapState } from 'vuex'
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
        this.$store.dispatch(actions.GET_CURRENT_NETWORK);

      } else {
        // TODO fire action - WEB_3_NOT_FOUND - show error banner
      }
    },
  }
</script>

<style>

  /* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* http://meyerweb.com/eric/tools/css/reset/
 v2.0 | 20110126
 License: none (public domain)
 ---END---
*/

  h1 {
    display: block;
    font-size: 38px;
    padding: 10px;
  }

  h2 {
    display: block;
    font-size: 24px;
    padding: 10px;
  }

  p {
    padding: 10px;
    line-height: 1.5;
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

  .btn:disabled {
    background: grey;
    text-decoration: none;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background-color: #f2f2f2;
    margin: 0;
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

  .centered {
    margin: 0 auto;
    padding: 0 1em;
  }

  @media screen and (min-width: 52em) {
    .centered {
      max-width: 52em;
    }
  }

  /*--------------------------------------------------------------
  Header styles minus menu
  --------------------------------------------------------------*/

  .card {
    background: white;
    margin-bottom: 2em;
  }

  .card a {
    color: black;
    text-decoration: none;
  }

  .card a:hover {
    box-shadow: 3px 3px 8px hsl(0, 0%, 70%);
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

</style>
