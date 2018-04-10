<template>
  <div v-if="asset">

    <router-link
      :to="{ name: 'confirmPurchase',
        params: { edition: asset.edition }}"
      class="back-arrow" style="float: left">
      <img src="../../../static/back_arrow.svg" style="width: 35px"/>
    </router-link>

    <h1>&nbsp;</h1>

    <article class="card assets_to_buy pad-bottom">
      <div>
        <div class="border-box">
          <div class="card-content">

            <div v-if="isPurchaseTriggered(asset.id)" class="icon-message">
              <img src="../../../static/Timer.svg" style="width: 100px"/>
              <h2 class="text-blue pad-top">Your purchase is being initiated...</h2>
            </div>

            <div v-if="isPurchaseStarted(asset.id)" class="icon-message">
              <img src="../../../static/Timer.svg" style="width: 100px"/>
              <h2 class="text-blue pad-top">Your purchase is being confirming...</h2>
            </div>

            <div v-if="isPurchaseSuccessful(asset.id)" class="icon-message">
              <img src="../../../static/GreenTick.svg" style="width: 100px"/>
              <h2 class="text-success pad-top">Your purchase was successful!</h2>
            </div>

            <div v-if="isPurchaseFailed(asset.id)" class="icon-message">
              <img src="../../../static/Failure.svg" style="width: 100px"/>
              <h2 class="text-danger pad-top">Your purchase failed!</h2>
            </div>

            <h3>{{ asset.otherMeta.artworkName }}</h3>

            <edition-name-by-artist :edition="asset" :purchase="true"></edition-name-by-artist>

            <token-id :value="asset.id"></token-id>

            <hr/>

            <div v-if="!assetPurchaseState(asset.id)">

              <div v-if="asset.purchased == 0" class="pad-top pad-bottom">
                <table>
                  <tr>
                    <td width="25%"><img src="/../../static/Account_You_icn.svg" style="height: 50px"/></td>
                    <td width="75%">
                      You:<br/>
                      <address-icon :eth-address="account" :size="'small'"></address-icon>
                    </td>
                  </tr>
                  <tr>
                    <td width="25%"><img src="/../../static/DotDivider@x2.svg" style="height: 50px"/></td>
                    <td width="75%"><hr/></td>
                  </tr>
                  <tr>
                    <td width="25%"><img src="/../../static/ETH_icn.svg" style="height: 50px"/></td>
                    <td width="75%">
                      Amount:<br/>
                      <strong>{{ asset.priceInEther }} ETH</strong>
                    </td>
                  </tr>
                  <tr>
                    <td width="25%"><img src="/../../static/DotDivider@x2.svg" style="height: 50px"/></td>
                    <td width="75%"><hr/></td>
                  </tr>
                  <tr>
                    <td width="25%"><img src="/../../static/Account_You_icn.svg" style="height: 50px"/></td>
                    <td width="75%">
                      Transfer to:<br/>
                      <address-icon :eth-address="asset.owner" :size="'small'"></address-icon>
                    </td>
                  </tr>
                </table>
              </div>

              <hr/>
            </div>

            <div><h3>Total ETH: <span class="pull-right ">{{ asset.priceInEther }}</span></h3></div>
          </div>
        </div>
        <div class="border-box-buttons">
          <div v-if="isPurchaseFailed(asset.id)" class="pad-bottom">
            <button type="button" v-on:click="retryPurchase" class="btn btn-link">
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
    }
  };
</script>

<style scoped>
  .border-box {
    border: 1px solid #545454;
    border-radius: 15px;
    margin: 15px;
  }

  .border-box-buttons {
    margin: 15px;
  }

  .icon-message {
    text-align: center;
    margin: 30px;
    padding: 10px;
  }

  h3 {
    line-height: 2em;
    margin: 0;
  }
</style>
