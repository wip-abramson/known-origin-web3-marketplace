<template>
  <article class="card" v-if="asset">
    <div>
      <asset-figure :edition="asset"></asset-figure>
      <div class="card-content">

        <div class="token-id">#0000{{asset.id}}</div>

        <edition-name-by-artist :edition="asset"></edition-name-by-artist>

        <p>{{ asset.otherMeta.description }}</p>

        <price-in-eth :value="asset.priceInEther"></price-in-eth>

        <button class="btn btn-sold">
          <purchase-state :state="asset.purchased"></purchase-state>
        </button>
      </div>
    </div>
    <!-- .card-content -->
  </article>

</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import _ from 'lodash';
  import PurchaseState from './ui-controls/PurchaseState.vue';
  import AddressIcon from './ui-controls/AddressIcon.vue';
  import AssetFigure from './AssetFigure.vue';
  import PriceInEth from './ui-controls/PriceInEth.vue';
  import EditionNameByArtist from './ui-controls/EditionNameByArtist.vue';

  export default {
    components: {AddressIcon, PurchaseState, AssetFigure, PriceInEth, EditionNameByArtist},
    name: 'asset',
    props: {
      asset: {
        type: Object
      },
    },
    computed: {
      ...mapGetters([]),
    }
  };
</script>

<style scoped>
  .token-id {
    font-weight: bold;
    color: #3e27d9;
    font-size: 1.25em;
  }
</style>
