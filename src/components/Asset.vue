<template>
  <article class="card" v-if="asset">
    <div>
      <asset-figure :edition="asset" :is-asset="true"></asset-figure>
      <div class="card-content">

        <token-id :value="asset.id"></token-id>

        <edition-name-by-artist :edition="asset"></edition-name-by-artist>

        <p>{{ asset.otherMeta.description }}</p>

        <price-in-eth :value="asset.priceInEther"></price-in-eth>
        
      </div>
    </div>
    <!-- .card-content -->
  </article>

</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import _ from 'lodash';
  import PurchaseState from './ui-controls/PurchaseState';
  import AddressIcon from './ui-controls/AddressIcon';
  import AssetFigure from './AssetFigure';
  import PriceInEth from './ui-controls/PriceInEth';
  import TokenId from './ui-controls/TokenId';
  import EditionNameByArtist from './ui-controls/EditionNameByArtist';

  export default {
    components: {AddressIcon, PurchaseState, AssetFigure, PriceInEth, EditionNameByArtist, TokenId},
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

</style>
