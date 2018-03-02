<template>
  <div class="edition-tile">
    <p><strong>{{ edition.edition }}</strong> <span style="float: right">{{ count }}</span></p>
    <img src="https://picsum.photos/400/400"/>
    <p>{{ edition.meta.artist_name }}</p>
    <p>{{ edition.meta.type }}</p>
    <p><i>{{ edition.priceInEther }} ETH</i></p>
    <p><i>{{ edition.owner }}</i></p>
  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'

  export default {
    name: 'edition',
    props: ['edition', 'count'],
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .edition-tile {
    text-align: center;
    padding: 10px;
    margin: 5px;
    border: 1px solid gray;
  }
</style>
