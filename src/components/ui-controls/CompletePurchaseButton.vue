<template>
  <div class="complete_purchase_container">
    <form v-if="account">

      <div v-if="!assetPurchaseState(asset.id)">

        <div class="pad-bottom" v-if="isUnsold">
          <input type="checkbox" :id="'confirm_terms'" v-model="confirm_terms">
          <label :for="'confirm_terms'">I agree with KODA license</label>
        </div>

        <div class="pad-bottom muted license-text" v-if="isUnsold">
          By choosing <strong>I agree</strong>, you understand and agree to KnownOrigin's term of service and usage license.
          <router-link :to="{ name: 'license' }" target="_blank">Read license</router-link>
        </div>

        <button type="button" class="btn btn-success"
                :disabled="!confirm_terms || isPurchaseTriggered(asset.id)"
                v-on:click="completePurchase" v-if="isUnsold">
          Confirm buy
        </button>

        <div class="pad-top">
          <button type="button" v-on:click="completeFiatPurchase" class="btn btn-warning" v-if="isKnownOrigin && !soldAsFiat">
            FIAT purchase
          </button>

          <button type="button" v-on:click="reverseFiatPurchase" class="btn btn-danger" v-if="isKnownOrigin && soldAsFiat">
            Reverse FIAT purchase
          </button>
        </div>
      </div>

      <!--<div>-->
        <!--<button class="btn btn-sold" v-if="asset.purchased !== 0">-->
          <!--SOLD-->
        <!--</button>-->
      <!--</div>-->

      <div class="pad-bottom">
        <router-link v-if="asset.purchased !== 0" :to="{ name: 'account'}" class="btn btn-link">
          View account
        </router-link>
      </div>

      <div>
        <router-link :to="{ name: 'gallery'}" class="btn btn-muted">
          Back to gallery
        </router-link>
      </div>

    </form>

    <p v-if="!account">
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
        'isKnownOrigin',
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
