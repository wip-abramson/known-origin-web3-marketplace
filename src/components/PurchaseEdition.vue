<template>
  <div class="assets_to_buy">
    <h1>{{ title }}</h1>

    <div>
      <p>Purchase the <strong>{{assetsForArtistAndEdition($route.params.artist, $route.params.edition)[0].meta.type}}</strong> asset</p>
      <p>
        Available {{ countAvailable(assetsForArtistAndEdition($route.params.artist, $route.params.edition)).length }} |
        Purchased {{ countPurchased(assetsForArtistAndEdition($route.params.artist, $route.params.edition)).length }}
      </p>

      <!-- edition overview -->
      <edition :edition="assetsForArtistAndEdition($route.params.artist, $route.params.edition)[0]" :count="assetsForArtistAndEdition($route.params.artist, $route.params.edition).length" :hide-buy-button="true"></edition>

      <!-- the final purchase button -->
      <complete-purchase-button :editions="assetsForArtistAndEdition($route.params.artist, $route.params.edition)"></complete-purchase-button>

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
        'assetsForArtistAndEdition'
      ]),

    },
    mounted() {

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
