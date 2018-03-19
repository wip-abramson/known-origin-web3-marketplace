<template>
  <div id="account">
    <h1><router-link :to="{ name: 'dashboard' }" class="back-arrow">&lt;</router-link> Account</h1>

    <p>My address: {{ account }} <address-icon :eth-address="account"></address-icon></p>

    <h2>My collection <span class="bold">{{assetsPurchasedByAccount.length}} assets</span></h2>


    <div class="centered">
      <section class="cards" v-if="assetsPurchasedByAccount">
        <Asset v-for="tokenId, key in assetsPurchasedByAccount"
               :asset="assetById(tokenId)"
               :key="key">
        </Asset>
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

  export default {
    name: 'dashboard',
    components: {Asset, AddressIcon},
    computed: {
      ...mapState([
        'account',
        'accountBalance',
        'assetsPurchasedByAccount',
      ]),
      ...mapGetters([
        'assetById',
      ])
    },
    mounted () {

    }
  };
</script>

<style scoped>
</style>
