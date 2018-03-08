<template>
  <div class="assets_to_buy">
    <h1>{{ title }}</h1>

    <div class="centered">
      <p>
        Available {{ countAvailable(assetsForEdition($route.params.edition)).length }} |
        Purchased {{ countPurchased(assetsForEdition($route.params.edition)).length }}
      </p>

      <!-- edition overview -->
      <edition :edition="firstAssetForEdition($route.params.edition)"
               :hide-buy-button="true">
      </edition>

      <!-- the final purchase button -->
      <complete-purchase-button :editions="assetsForEdition($route.params.edition)"></complete-purchase-button>

    </div>

  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'
  import Artist from './Artist'
  import Edition from './Edition'
  import CompletePurchaseButton from './CompletePurchaseButton'
  import _ from 'lodash'

  export default {
    name: 'purchaseEdition',
    components: {Edition, CompletePurchaseButton},
    data() {
      return {
        title: 'Assets to buy',
      }
    },
    computed: {
      ...mapGetters([
        'assetsForEdition',
        'firstAssetForEdition'
      ]),
    },
    methods: {
      countPurchased: (assets) => {
        return _.filter(assets, (val) => {
          return val.purchased === 1 || val.purchased === 2;
        })
      },
      countAvailable: (assets) => {
        return _.filter(assets, {'purchased': 0})
      }
    }
  }
</script>

<style scoped>

</style>
