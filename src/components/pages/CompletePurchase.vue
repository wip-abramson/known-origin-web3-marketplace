<template>
  <div class="assets_to_buy" v-if="asset">
    <h1>{{ asset.editionName }}</h1>
    <h2>{{ asset.edition }}</h2>
    <h2>{{ asset.id }}</h2>

    <div class="centered" v-if="asset">
      <section>
        <div class="card-content">

          <!-- TODO extract component -->

          <!-- TODO on completion replace content with confirmation -->

          <p class="purchased">{{ purchasedState(asset.purchased) }}</p>

          <p>You 01223456787654678987 (account address)</p>

          <p><i>{{ asset.priceInEther }} ETH</i></p>

          <p>{{ asset.asset }}</p>

          <p>Deposit to: {{ asset.owner }}</p>

          <hr>
          <p>Total ETH {{ asset.priceInEther }}</p>

        </div>

        <complete-purchase-button :asset="asset"></complete-purchase-button>

        <a href="#">TODO back to gallery link</a>

        <hr>

      </section>
    </div>

  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import Artist from '../Artist';
  import Asset from '../Asset';
  import CompletePurchaseButton from '../ui-controls/CompletePurchaseButton';
  import _ from 'lodash';

  export default {
    name: 'completePurchase',
    components: {Asset, CompletePurchaseButton},
    data () {
      return {};
    },
    computed: {
      ...mapGetters([
        'assetsForEdition',
        'firstAssetForEdition'
      ]),
      title: function () {
        return `${this.$route.params.edition} - ID ${this.$route.params.tokenId}`;
      },
      asset: function () {
        return this.$store.getters.assetById(this.$route.params.tokenId);
      }
    },
    methods: {
      purchasedState: (purchasedId) => {
        switch (purchasedId) {
          case 0:
            return 'AVAILABLE';
          case 1:
            return 'SOLD CRYPTO';
          case 2:
            return 'SOLD FIAT';
          default:
            return 'ERRRR...';
        }
      }
    }
  };
</script>

<style scoped>
  .purchased {
    background-color: cornflowerblue;
  }
</style>
