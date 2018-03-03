<template>
  <div class="assets_to_buy">
    <h1>{{ title }}</h1>

    <div v-for="value, key in assetsForArtistAndEditionByType($route.params.artist, $route.params.edition)">
      <p>Purchase the <strong>{{key}}</strong> asset</p>
      <p>Available {{ countAvailable(value).length }} | Purchased {{ countPurchased(value).length }}</p>

      <edition :edition="value[0]" :count="value.length"></edition>
      
      {{ value }}

    </div>

  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'
  import Artist from './Artist'
  import Edition from './Edition'
  import _ from 'lodash'

  export default {
    name: 'purchaseEdition',
    components: {Edition},
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
