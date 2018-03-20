<template>
  <div class="complete_purchase_container">
    <form v-if="account">
      <p>
        <input type="checkbox" :id="'confirm_terms'" v-model="confirm_terms">
        <label :for="'confirm_terms'">I agree with KODA license</label>
      </p>
      <div class="license-text">
        By choosing <strong>I agree</strong>, you understand and agree to KnownOrigin's term of service and usage license.
        <router-link :to="{ name: 'license' }">Read license</router-link>
      </div>
      <p>
        <button type="button" class="btn" :disabled="!confirm_terms" v-on:click="completePurchase" v-if="isUnsold">
          Confirm purchase
        </button>

        <button type="button" v-on:click="completeFiatPurchase" class="btn btn-warning" v-if="isCurator && !soldAsFiat">
          FIAT Purchase
        </button>

        <button type="button" v-on:click="reverseFiatPurchase" class="btn btn-danger" v-if="isCurator && soldAsFiat">
          Reverse FIAT Purchase
        </button>

        <button v-if="asset.purchased !== 0" class="btn btn-sold">
          SOLD
        </button>
      </p>
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

  export default {
    name: 'completePurchaseButton',
    components: {},
    props: {
      asset: {
        required: true,
        type: Object
      },
    },
    computed: {
      ...mapGetters(['isCurator']),
      ...mapState(['account']),
      soldAsFiat: function () {
        return this.asset.purchased === 2;
      },
      isUnsold: function () {
        return this.asset.purchased === 0;
      },
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
