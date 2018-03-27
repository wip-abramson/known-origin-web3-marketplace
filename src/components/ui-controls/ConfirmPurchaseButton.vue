<template>
  <div class="confirm_purchase_container">
    <button type="button" v-on:click="confirmPurchase" class="btn btn-primary" v-if="findNextAssetToPurchase(edition)">
      Buy Now
    </button>

    <button class="btn btn-sold" v-if="!findNextAssetToPurchase(edition)">
       SOLD
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
            artistCode: nextAssetToPurchase.edition.substring(0, 3),
            edition: nextAssetToPurchase.edition,
            tokenId: nextAssetToPurchase.id
          }
        });
      }
    }
  };
</script>

<style scoped>


</style>
