<template>
  <div class="complete_purchase_container">
    <form>
      <p>
        <input type="checkbox"
               :id="'confirm_terms_' + editionType"
               v-model="confirm_terms">
        <label :for="'confirm_terms_' + editionType">I confirm that I have read the T&C's blah blah blah blah</label>
      </p>
      <p>
        <button type="button" :disabled="!confirm_terms" v-on:click="completePurchase">
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
      editionType: {
        required: true,
        type: String
      },
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
    mounted() {
    },
    computed: {
      ...mapGetters([]),
      ...mapState([]),
    },
    methods: {
      completePurchase: function () {
        console.log("Completing purchase");

        let nextAssetToPurchase = _.chain(this.editions)
          .orderBy('editionNumber')
          .filter({purchased: 0})
          .head()
          .value();

        this.$store.dispatch(actions.PURCHASE_ASSET, nextAssetToPurchase)
      }
    }
  }
</script>

<style scoped>

</style>
