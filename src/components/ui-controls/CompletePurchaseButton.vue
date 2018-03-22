<template>
  <div class="complete_purchase_container">
    <form v-if="account">

      <div id="purchase-state-feedback-container">

        <div v-if="isPurchaseTriggered(asset.id)">
          Purchased Triggered
        </div>

        <div v-if="isPurchaseStarted(asset.id)">
          Transaction Submitted
        </div>

        <div v-if="isPurchaseSuccessful(asset.id)">
          Purchase complete!
        </div>

        <div v-if="isPurchaseFailed(asset.id)">
          Purchase Rejected
        </div>
      </div>

      <div v-if="isPurchaseFailed(asset.id) || !assetPurchaseState(asset.id)">

        <p v-if="isUnsold">
          <input type="checkbox" :id="'confirm_terms'" v-model="confirm_terms">
          <label :for="'confirm_terms'">I agree with KODA license</label>
        </p>

        <div class="license-text" v-if="isUnsold">
          By choosing <strong>I agree</strong>, you understand and agree to KnownOrigin's term of service and usage license.
          <router-link :to="{ name: 'license' }">Read license</router-link>
        </div>

      </div>

      <div v-if="isPurchaseFailed(asset.id) || !assetPurchaseState(asset.id)">

        <button type="button" class="btn"
                :disabled="!confirm_terms || isPurchaseTriggered(asset.id)"
                v-on:click="completePurchase" v-if="isUnsold">
          Confirm purchase
        </button>

        <button type="button" v-on:click="completeFiatPurchase" class="btn btn-warning" v-if="isCurator && !soldAsFiat">
          FIAT Purchase
        </button>

        <button type="button" v-on:click="reverseFiatPurchase" class="btn btn-danger" v-if="isCurator && soldAsFiat">
          Reverse FIAT Purchase
        </button>
      </div>

      <button v-if="asset.purchased !== 0" class="btn btn-sold" v-on:click.prevent>
        SOLD
      </button>

    </form>

    <p v-if="!account" class="error">
      Your account is locked!
    </p>

  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import _ from 'lodash';
  import * as actions from '../../store/actions';
  import * as mutations from '../../store/mutation-types';
  import AddressIcon from './AddressIcon.vue';

  export default {
    name: 'completePurchaseButton',
    components: {AddressIcon},
    props: {
      asset: {
        required: true,
        type: Object
      },
    },
    computed: {
      ...mapGetters([
        'isCurator',
        'assetPurchaseState',
        'isPurchaseTriggered',
        'isPurchaseStarted',
        'isPurchaseSuccessful',
        'isPurchaseFailed',
      ]),
      ...mapState(['account', 'purchaseState']),
      soldAsFiat: function () {
        return this.asset.purchased === 2;
      },
      isUnsold: function () {
        return this.asset.purchased === 0;
      }
    },
    data () {
      return {
        confirm_terms: false
      };
    },
    methods: {
      completePurchase: function () {
        console.log('Completing purchase', this.asset);
        this.$emit('purchaseInitiated', this.asset);
        this.$store.dispatch(actions.PURCHASE_ASSET, this.asset);
      },
      completeFiatPurchase: function () {
        console.log('Completing FIAT purchase', this.asset);
        this.$emit('purchaseInitiated', this.asset);
        this.$store.dispatch(actions.PURCHASE_ASSET_WITH_FIAT, this.asset);
      },
      reverseFiatPurchase: function () {
        console.log('Reverse FIAT purchase', this.asset);
        this.$emit('purchaseInitiated', this.asset);
        this.$store.dispatch(actions.REVERSE_PURCHASE_ASSET_WITH_FIAT, this.asset);
      }
    }
  };
</script>

<style scoped>


</style>
