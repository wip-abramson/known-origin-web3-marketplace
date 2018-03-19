<template>
  <div class="confirm_purchase_container">
    <form v-if="findNextAssetToPurchase(edition)">
      <p>
        <button type="button" v-on:click="confirmPurchase" class="btn">
          Buy Now
        </button>
      </p>
    </form>

    <button class="btn-warning" v-if="!findNextAssetToPurchase(edition)">
       SOLD OUT
    </button>

  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import _ from 'lodash';
  import * as actions from '../../store/actions';

  export default {
    name: 'confirmPurchaseButton',
    components: {},
    props: {
      edition: {
        required: true,
        type: Object
      },
    },
    computed: {
      ...mapGetters(['isCurator', 'findNextAssetToPurchase']),
    },
    data () {
      return {
        confirm_terms: false
      };
    },
    methods: {
      confirmPurchase: function () {
        let nextAssetToPurchase = this.$store.getters.findNextAssetToPurchase(this.edition);

        console.log('confirming purchase', nextAssetToPurchase);

        this.$router.push({
          name: 'completePurchase',
          params: {
            edition: nextAssetToPurchase.edition,
            tokenId: nextAssetToPurchase.id
          }
        });
      }
    }
  };
</script>

<style scoped>

  .btn-warning {
    background-color: darkorange;
  }
</style>
