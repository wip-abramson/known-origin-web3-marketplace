<template>
  <div class="complete_purchase_container">
    <form>
      <p>
        <input type="checkbox"
               :id="'confirm_terms'"
               v-model="confirm_terms">
        <label :for="'confirm_terms'">I confirm that I have read the T&C's blah blah blah blah</label>
      </p>
      <p>
        <button type="button" :disabled="!confirm_terms" v-on:click="completePurchase" class="btn">
          Purchase with Ether
        </button>
      </p>
    </form>
  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'
  import _ from 'lodash'
  import * as actions from '../store/actions'

  export default {
    name: 'completePurchaseButton',
    components: {},
    props: {
      editions: {
        required: true,
        type: Array
      },
    },
    data() {
      return {
        confirm_terms: false
      }
    },
    methods: {
      completePurchase: function () {


        let nextAssetToPurchase = _.chain(this.editions)
          .orderBy('editionNumber')
          .filter({purchased: 0})
          .head()
          .value();

        console.log("Completing purchase");
        console.log(nextAssetToPurchase);

        this.$store.dispatch(actions.PURCHASE_ASSET, nextAssetToPurchase)
      }
    }
  }
</script>

<style scoped>

</style>
