<template>
  <div class="assets_to_buy">
    <h1>{{ title }}</h1>

    {{assetsForArtistAndEditionByType($route.params.artist, $route.params.edition)}}

  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'
  import Artist from './Artist'

  export default {
    name: 'purchaseEdition',
    components: {},
    data() {
      return {
        title: 'Assets to buy',
      }
    },
    computed: {
      ...mapGetters([
        'assetsForArtistAndEdition',
        'assetsForArtistAndEditionByType'
      ])
    },
    mounted() {

    },
  }
</script>

<style scoped>

</style>
