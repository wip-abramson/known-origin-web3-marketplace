<template>
  <div id="account">
    <h1>{{ title }}</h1>

    <p>My address: {{ account }}</p>

    <p>{{ accountBalance }} ETH</p>

    <h2>My Collection</h2>

    <p>{{ assetsPurchasedByAccount.length }} Purchased</p>

    <div class="centered">
      <section class="cards">
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

  export default {
    name: 'dashboard',
    components: {Asset},
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
