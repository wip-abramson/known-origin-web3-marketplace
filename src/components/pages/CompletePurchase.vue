<template>
  <div v-if="asset">

    <h1>
      <router-link
        :to="{ name: 'confirmPurchase',
        params: { edition: asset.edition }}"
        class="back-arrow">&lt;
      </router-link>
      {{ asset.editionName }}
    </h1>

    <article class="card assets_to_buy centered">
        <div>
          <div class="card-content">

            <token-id :value="asset.id"></token-id>

            <edition-name-by-artist :edition="asset"></edition-name-by-artist>

            <div v-if="asset.purchased == 0" class="pad-top pad-bottom">
              You: <address-icon :eth-address="account" :size="'small'"></address-icon>
            </div>

            <price-in-eth :value="asset.priceInEther"></price-in-eth>

            <div class="pad-top pad-bottom">
              Owner: <address-icon :eth-address="asset.owner" :size="'small'"></address-icon>
            </div>

            <complete-purchase-button :asset="asset" class="btn-center pad-bottom" @purchaseInitiated="onPurchaseInitiated">
            </complete-purchase-button>
          </div>
        </div>
    </article>

  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import Artist from '../Artist';
  import Asset from '../Asset';
  import CompletePurchaseButton from '../ui-controls/CompletePurchaseButton';
  import _ from 'lodash';
  import AddressIcon from '../ui-controls/AddressIcon';
  import PurchaseState from '../ui-controls/PurchaseState';
  import AssetFigure from '../AssetFigure';
  import PriceInEth from '../ui-controls/PriceInEth';
  import TokenId from '../ui-controls/TokenId.vue';
  import EditionNameByArtist from '../ui-controls/EditionNameByArtist';
  import * as mutations from '../../store/mutation-types';
  import { KnownOriginDigitalAsset } from '../../contracts/index';

  export default {
    name: 'completePurchase',
    components: {
      PurchaseState,
      Asset,
      AddressIcon,
      CompletePurchaseButton,
      PriceInEth,
      AssetFigure,
      EditionNameByArtist,
      TokenId
    },
    data () {
      return {
        confirm_terms: false
      };
    },
    computed: {
      ...mapGetters([
        'assetsForEdition',
        'firstAssetForEdition',
        'isCurator'
      ]),
      ...mapState([
        'account'
      ]),
      title: function () {
        return `${this.$route.params.edition} - ID ${this.$route.params.tokenId}`;
      },
      asset: function () {
        return this.$store.getters.assetById(this.$route.params.tokenId);
      },
      soldAsFiat: function () {
        return this.asset.purchased === 2;
      }
    },
    methods: {
      onPurchaseInitiated: function () {
        console.log('onPurchaseInitiated');
      },
    },
    updated: function () {

    },
    beforeDestroy: function () {

    }
  };
</script>

<style scoped>

</style>
