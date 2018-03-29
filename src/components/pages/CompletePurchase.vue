<template>
  <div v-if="asset">

    <router-link
      :to="{ name: 'confirmPurchase',
        params: { edition: asset.edition }}"
      class="back-arrow" style="float: left">
      <img src="../../../static/back_arrow.svg" style="width: 50px"/>
    </router-link>

    <h1>
      {{ asset.otherMeta.artworkName }}
    </h1>

    <article class="card assets_to_buy pad-bottom">
      <div>
        <div class="card-content">
          <token-id :value="asset.id"></token-id>

          <edition-name-by-artist :edition="asset" :purchase="true"></edition-name-by-artist>

          <hr/>

          <div v-if="isPurchaseTriggered(asset.id)">
            <h2>Your purchase is being initiated</h2>
          </div>

          <div v-if="isPurchaseStarted(asset.id)">
            <h2>Your purchase is being mined on the Blockchain...</h2>
          </div>

          <div v-if="isPurchaseSuccessful(asset.id)">
            <img src="../../../static/GreenTick.svg" style="width: 150px"/>
            <h2 class="text-success pad-top">Your purchase was successful</h2>
          </div>

          <div v-if="isPurchaseFailed(asset.id)">
            <img src="../../../static/Failure.svg" style="width: 150px"/>
            <h2 class="text-danger pad-top">Your purchase failed</h2>
          </div>

          <div v-if="!assetPurchaseState(asset.id)">
            <div v-if="asset.purchased == 0" class="pad-top pad-bottom">
              <p>You:<br/>
                <address-icon :eth-address="account" :size="'small'"></address-icon>
              </p>
            </div>

            <price-in-eth :value="asset.priceInEther"></price-in-eth>

            <div class="pad-top pad-bottom">
              <p>Transfer to:<br/>
                <address-icon :eth-address="asset.owner" :size="'small'"></address-icon>
              </p>
            </div>
            <hr/>
          </div>

          <p>Total ETH: {{ asset.priceInEther }}</p>

          <div v-if="isPurchaseFailed(asset.id)">
            <button type="button" v-on:click="retryPurchase" class="btn">
              Retry
            </button>
          </div>

          <complete-purchase-button :asset="asset" class="pad-bottom" @purchaseInitiated="onPurchaseInitiated">
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
  import * as actions from '../../store/actions';

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
        'isCurator',
        'assetPurchaseState',
        'isPurchaseTriggered',
        'isPurchaseStarted',
        'isPurchaseSuccessful',
        'isPurchaseFailed',
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
      retryPurchase: function () {
        this.$store.dispatch(actions.RESET_PURCHASE_STATE, this.asset);
      }
    },
    updated: function () {

    },
    beforeDestroy: function () {

    }
  };
</script>

<style scoped>

</style>
