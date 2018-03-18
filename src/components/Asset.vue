<template>
  <article class="card" v-if="asset">
    <a href="#">
      <asset-figure :edition="asset"></asset-figure>
      <div class="card-content">

        <edition-name-by-artist :edition="asset"></edition-name-by-artist>

        <purchase-state :state="asset.purchased"></purchase-state>

        <p>TOKEN ID {{asset.id}}</p>

        <p>{{ asset.asset }}</p>

        <p>
          Owner: {{ asset.owner }} <br />
          <address-icon :eth-address="asset.owner" :size="'small'"></address-icon>
        </p>

        <p>{{ asset.otherMeta.description }}</p>

        <price-in-eth :value="asset.priceInEther"></price-in-eth>

      </div>
    </a>
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

</style>
