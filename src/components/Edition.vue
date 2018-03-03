<template>
  <div class="edition-tile">
    <p>{{edition.meta.artistName}} - <strong>{{ edition.edition }}</strong> <span style="float: right">1 of {{ count
      }}</span></p>
    <img :src="edition.lowResImg"/> <!-- add real IPFS image -->
    <p>{{ edition.meta.artistNme }}</p>
    <p>{{ edition.ipfsMeta.description }}</p>
    <p>{{ edition.meta.type }} | {{edition.ipfsMeta.editionType}}</p>
    <p><i>{{ edition.priceInEther }} ETH</i></p>
    <p>Owner: {{ edition.owner }}</p>
    <!--<p>{{ assetsForArtistAndEdition(edition.meta.artistName, edition.edition) }}</p>-->
    <!--<p>{{ assetsForArtistAndEditionByType(edition.meta.artistName, edition.edition) }}</p>-->
    
  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'

  export default {
    name: 'edition',
    props: ['edition', 'count'],
    computed: {
      ...mapState([]),
      ...mapGetters([
        'assetsForArtistAndEdition',
        'assetsForArtistAndEditionByType'
      ])
    }
  }
</script>

<style scoped>
  .edition-tile {
    text-align: center;
    padding: 10px;
    margin: 5px;
    border: 1px solid gray;
  }
</style>
