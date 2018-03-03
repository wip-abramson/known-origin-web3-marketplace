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

    <router-link :to="{
      name: 'purchaseEdition',
      params: {
        artist: edition.meta.artistName,
        edition: edition.edition
      }
    }" tag="button" class="btn">Buy Now</router-link>
  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'

  export default {
    name: 'edition',
    props: ['edition', 'count'],
    computed: {
      ...mapState([]),
      ...mapGetters([])
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
