<template>
  <div class="edition-tile">
    <p><strong>{{ edition.edition }}</strong> <span style="float: right">1 of {{ count }}</span></p>
    <img :src="edition.low_res_img"/> <!-- add real IPFS image -->
    <p>{{ edition.meta.artist_name }}</p>
    <p>{{ edition.ipfs_meta.description }}</p>
    <p>{{ edition.meta.type }} | {{edition.ipfs_meta.edition_type}}</p>
    <p><i>{{ edition.priceInEther }} ETH</i></p>
    <p>Owner: {{ edition.owner }}</p>
  </div>
</template>

<script>
  export default {
    name: 'edition',
    props: ['edition', 'count'],
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
