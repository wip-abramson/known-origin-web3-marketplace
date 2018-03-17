<template>
  <div class="assets_to_buy" v-if="asset">


    <div class="centered" v-if="asset">
      <section>
        <div class="card-content">

          <!-- TODO extract component -->

          <!-- TODO on completion replace content with confirmation -->

          <h2>#{{ asset.id }}</h2>

          <h3>
            {{ asset.editionName }}
            by
            {{ asset.artist }}
          </h3>

          <purchase-state :state="asset.purchased"></purchase-state>

          <p class="btn-center">
            <img :src="asset.lowResImg" style="max-width: 150px"/>
          </p>

          <p>
            You: {{ account }}<br/>
            <address-icon :eth-address="account"></address-icon>
          </p>

          <p>
            To: {{ asset.owner }}<br/>
            <address-icon :eth-address="asset.owner"></address-icon>
          </p>

          <p class="price">Price {{ asset.priceInEther }} ETH</p>

        </div>

        <complete-purchase-button :asset="asset" class="btn-center"></complete-purchase-button>
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
  import AddressIcon from '../utils/AddressIcon';
  import PurchaseState from '../utils/PurchaseState.vue';

  export default {
    name: 'completePurchase',
    components: {PurchaseState, Asset, AddressIcon, CompletePurchaseButton},
    data () {
      return {};
    },
    computed: {
      ...mapGetters([
        'assetsForEdition',
        'firstAssetForEdition'
      ]),
      ...mapState([
        'account'
      ]),
      title: function () {
        return `${this.$route.params.edition} - ID ${this.$route.params.tokenId}`;
      },
      asset: function () {
        return this.$store.getters.assetById(this.$route.params.tokenId);
      }
    }
  };
</script>

<style scoped>

  .assets_to_buy {
    margin-left: 170px;
    margin-right: 170px;
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .btn-center {
    text-align: center;
  }

  .price {
    font-weight: bold;
    font-size: 1.25em;
    text-align: center;
  }
</style>
