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
$primary:#2366de;
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
h1 {
display: block;
    font-size: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
    color: #2366de;
    border-bottom: 1px;
}

#splash h2{
color:#FFF;
font-size:18px;



}
h2 {
color: $primary;
  display: block;
  font-size: 28px;
  margin-top:20px;
  margin-bottom:20px;

}
h3 {
  display: block;
  color: $primary;
  font-size: 16px;
  margin-top: 15px;
  margin-bottom: 15px;
  font-weight: bold;
}

p {
  
  line-height: 28px;
  margin-bottom:10px;
  color:#545454;
}

#footer p{
color: rgba(255,255,255,0.5);
}
*{
box-sizing:border-box;
}

.btn {
  background: $primary;
  color: $secondary;
  font-size: 20px;
  padding: 10px 20px 10px 20px;
  text-decoration: none;
  margin: 10px;
  border:none;
  border-radius:7px;
  &:hover {
    text-decoration: none;
  }
  &:disabled {
    background: $gray;
    text-decoration: none;
  }
}
.router-link-exact-active {
  font-weight: normal;
}
#app {
  font-family: $font_family_1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f2f5fb;
  margin: 0;
}
a {
  color: $primary;
}
#header {
  color: $primary;
  padding: 10px;
  margin-bottom: 10px;
  background-color:#FDFDFD;
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
  font-weight: 300;
  font-style: normal;
  font-size: 26px;
  letter-spacing: 0em;
  line-height: 1em;
  text-transform: none;
  color: $primary;
}
.centered {
  margin: 0 auto;
  padding: 0 10px;
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
  margin-bottom: 15px;
  
  a {
    color: $black;
    text-decoration: none;
  }
}
.card-content {
  padding: 10px;
  h2 {
    margin-top: 0;
    margin-bottom: .5em;
    font-weight: normal;
    text-align:center;
  }
  p {
    font-size: 95%;

  }
}
#featured-artists{
margin-top:20px!important;
}

#featured-artists img, .artists img{
width: 75%;
margin-left:12%;}
img {
  width: 100%;
  height: auto;
}
.muted {
  color: $gray;
}
.bold {
  font-weight: bold;
}
.btn-center {
  text-align: center;
}
.pull-right {
  float: right;
  margin-top: 6px;
  text-decoration: none;
  font-size:15px;
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
  background-color: $sold;
  color: $white;
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

@media only screen and (max-width: 768px) {
    #topSection{
        flex-direction:column!important;
    }
    #splash{
    width:100%!important;}
    
    #intro{
    width:100%!important;
    }
    
    #intro h2{
    margin-top:20px!important;
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

.btn-warning {
  background-color: $warning;
}

.btn-danger {
  background-color: $sold;
}

.error {
  background-color: $sold;
}

strong {
  font-weight: bold;
}

.license-text {
  font-size: 0.8em;
  margin: 5px;
}
.current-network {
  font-size: 12px;
}

#partners, #quote {
  text-align: center;
  margin: 5px;
}

#splash {
display:table;
  text-align: center;
  color: $white;
  background-image: url('../static/background.jpg');
  width:50%;
  height:300px;


  .strap {
        padding-top: 58px;
    font-size: 28px;
    line-height: 1.5em;
    min-height: 164px;
  }
}

#quote {
  text-align: left;
  font-size: 18px;
  font-style: italic;
  padding: 10px;
}
.assets_to_buy {
  background: $white;
  max-width: 400px;
}

.twitterLink{
display: block;
text-align: center;
margin-top:20px;

}

.artist-info{
display:flex;   
height:90%;
flex-direction:column;
}

#topSection{
display:flex;
flex-direction:row;
}

#intro{
padding-left:10px;
width:50%;
}

#intro h2{
margin-top:0px;
}

</style>
