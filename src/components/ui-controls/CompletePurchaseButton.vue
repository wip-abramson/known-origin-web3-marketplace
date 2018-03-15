<template>
  <div class="complete_purchase_container">
    <form>
      <p>
        <input type="checkbox" :id="'confirm_terms'" v-model="confirm_terms">
        <label :for="'confirm_terms'">I agree with KODA license</label>
      </p>
      <p>
        <router-link :to="{ name: 'license' }">Read license</router-link>
      </p>
      <p>
        <button type="button" :disabled="!confirm_terms" v-on:click="completePurchase" class="btn">
          Purchase
        </button>

        <button type="button" v-on:click="completeFiatPurchase" class="btn btn-warning" v-if="isCurator">
          FIAT Purchase
        </button>
      </p>
    </form>
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
    },
    data () {
      return {
        confirm_terms: false
      };
    },
    methods: {
      completePurchase: function () {
        console.log('Completing purchase');
        console.log(this.asset);
        this.$store.dispatch(actions.PURCHASE_ASSET, this.asset);
      },
      completeFiatPurchase: function () {
        console.log('Completing FIAT purchase');
        console.log(this.asset);
        this.$store.dispatch(actions.PURCHASE_ASSET_WITH_FIAT, this.asset);
      }
    }
  };
</script>

<style scoped>

  .btn-warning {
    background-color: darkorange;
  }
</style>
