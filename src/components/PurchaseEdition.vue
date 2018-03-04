<template>
  <div class="assets_to_buy">
    <h1>{{ title }}</h1>

    <div v-for="editions, editionType in assetsForArtistAndEditionByType($route.params.artist, $route.params.edition)">
      <p>Purchase the <strong>{{editionType}}</strong> asset</p>
      <p>Available {{ countAvailable(editions).length }} | Purchased {{ countPurchased(editions).length }}</p>

      <!-- edition overview -->
      <edition :edition="editions[0]" :count="editions.length" :hide-buy-button="true"></edition>

      <!-- the final purchase button -->
      <complete-purchase-button :edition-type="editionType" :editions="editions"></complete-purchase-button>

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
        'assetsForArtistAndEditionByType'
      ]),

    },
    mounted() {

    },
    methods: {
      countPurchased: (assets) => {
        return _.filter(assets, {'purchased': 1})
      },
      countAvailable: (assets) => {
        return _.filter(assets, {'purchased': 0})
      }
    }
  }
</script>

<style scoped>

</style>
