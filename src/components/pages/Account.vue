<template>
  <div id="account">
    <h1>{{ title }}</h1>

    <p>My address: {{ account }}</p>

    <p><address-icon :eth-address="account"></address-icon></p>

    <p>{{ accountBalance }} ETH</p>

    <h2>My Collection (total: {{assetsPurchasedByAccount.length}})</h2>

    <p>{{ assetsPurchasedByAccount.length }} Purchased</p>

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
    data () {
      return {
        title: 'My Account',
      };
    },
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
