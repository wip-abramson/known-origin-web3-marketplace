<template>
  <div>
    <h1>
      <router-link :to="{ name: 'confirmPurchase', params: { edition: asset.edition }}" class="back-arrow">&lt;</router-link>
      {{ asset.editionName }}
    </h1>

    <div class="assets_to_buy centered" v-if="asset">

      <div class="centered" v-if="asset">
        <section>

          <asset-figure :edition="asset" class="centered"></asset-figure>

          <div class="card-content">

            <div class="token-id">#0000{{ asset.id }}</div>

            <edition-name-by-artist :edition="asset"></edition-name-by-artist>

            <!--<h4>@ {{ asset.priceInEther }} ETH</h4>-->
            <br/>
            
            <div>
              You
              <!--{{ account }}-->
              <address-icon :eth-address="account" :size="'small'"></address-icon>
            </div>

            <price-in-eth :value="asset.priceInEther"></price-in-eth>

            <div>
              Current owner<br/>
              <!--{{ asset.owner }}-->
              <address-icon :eth-address="asset.owner" :size="'small'"></address-icon>
            </div>

          </div>

          <complete-purchase-button :asset="asset" class="btn-center" @purchaseInitiated="onPurchaseInitiated"></complete-purchase-button>
        </section>
      </div>

    </div>

    <purchase-state :state="asset.purchased"></purchase-state>

    {{ purchaseState }}

  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import Artist from '../Artist';
  import Asset from '../Asset';
  import CompletePurchaseButton from '../ui-controls/CompletePurchaseButton';
  import _ from 'lodash';
  import AddressIcon from '../ui-controls/AddressIcon';
  import PurchaseState from '../ui-controls/PurchaseState.vue';
  import AssetFigure from '../AssetFigure.vue';
  import PriceInEth from '../ui-controls/PriceInEth.vue';
  import EditionNameByArtist from '../ui-controls/EditionNameByArtist.vue';
  import * as mutations from '../../store/mutation-types';
  import { KnownOriginDigitalAsset } from '../../contracts/index';

  export default {
    name: 'completePurchase',
    components: {PurchaseState, Asset, AddressIcon, CompletePurchaseButton, PriceInEth, AssetFigure, EditionNameByArtist},
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
        'account',
        'purchaseState'
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
  .assets_to_buy {
    background: white;
    max-width: 400px;
  }
</style>
