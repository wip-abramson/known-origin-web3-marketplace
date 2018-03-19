<template>
  <div class="assets_to_buy" v-if="asset">

    <div class="centered" v-if="asset">
      <section>

        <div class="card-content">

          <!-- TODO extract component -->

          <!-- TODO on completion replace content with confirmation -->

          {{purchaseState}}

          <h2>#{{ asset.id }}</h2>

          <h3>
            {{ asset.editionName }}
            by
            {{ asset.artist }}
          </h3>

          <h4>@ {{ asset.priceInEther }} ETH</h4>

          <p class="btn-center">
            <img :src="asset.lowResImg" style="max-width: 150px"/>
          </p>

          <p>
            You<br/>
            {{ account }} <address-icon :eth-address="account" :size="'small'"></address-icon>
          </p>

          <p>
            Amount<br/>
            {{ asset.priceInEther }} ETH
          </p>

          <p>
            Current owner<br/>
            {{ asset.owner }} <address-icon :eth-address="asset.owner" :size="'small'"></address-icon>
          </p>

          <price-in-eth :value="asset.priceInEther"></price-in-eth>

          <purchase-state :state="asset.purchased"></purchase-state>

        </div>

        <complete-purchase-button :asset="asset" class="btn-center" @purchaseInitiated="onPurchaseInitiated"></complete-purchase-button>
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
  import AddressIcon from '../ui-controls/AddressIcon';
  import PurchaseState from '../ui-controls/PurchaseState.vue';
  import PriceInEth from '../ui-controls/PriceInEth.vue';
  import * as mutations from '../../store/mutation-types';
  import { KnownOriginDigitalAsset } from '../../contracts/index';

  export default {
    name: 'completePurchase',
    components: {PurchaseState, Asset, AddressIcon, CompletePurchaseButton, PriceInEth},
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
  }

  .price {
    font-weight: bold;
    font-size: 1.25em;
    text-align: center;
  }

</style>
