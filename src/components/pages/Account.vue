<template>
  <div id="account">
    <router-link :to="{ name: 'dashboard' }" class="back-arrow" style="float: left">
      <img src="../../../static/back_arrow.svg" style="width: 50px"/>
    </router-link>

    <h1>My Account</h1>

    <img src="/../static/account.svg" style="height:50px"/>

    <h3>My Address</h3>
    <p class="pad-bottom">
    <address-icon :eth-address="account"></address-icon>
    </p>

    <hr/>

    <h2>My collection ({{assetsPurchasedByAccount.length}})</h2>

    <div class="centered">
      <section class="cards centered" v-if="assetsPurchasedByAccount">
        <asset v-for="tokenId, key in assetsPurchasedByAccount"
               :asset="assetById(tokenId)"
               :key="key">
        </asset>
      </section>

      <section v-if="assetsPurchasedByAccount.length == 0">
        <p>You don't have any digital assets yet...</p>

        <div class="pad-top">
          <router-link :to="{ name: 'gallery'}" class="btn btn-link">
            View gallery
          </router-link>
        </div>
      </section>
    </div>

  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import Artist from '../Artist';
  import Gallery from './Gallery';
  import Asset from '../Asset';
  import AddressIcon from '../ui-controls/AddressIcon';
  import EthAddress from '../ui-controls/EthAddress';

  export default {
    name: 'account',
    components: {Asset, AddressIcon, EthAddress},
    computed: {
      ...mapState([
        'account',
        'accountBalance',
        'assetsPurchasedByAccount',
      ]),
      ...mapGetters([
        'assetById',
      ])
    }
  };
</script>

<style scoped>
  img {
    width: auto;
  }
</style>
