<template>
  <div class="edition-tile">
    <p>{{ edition.meta.artistName }} - <strong>{{ edition.edition }}</strong> <span style="float: right">1 of {{ count}}</span></p>
    <img :src="edition.lowResImg" style="max-width: 400px"/> <!-- add real IPFS image -->
    <p>{{ edition.ipfsMeta.description }}</p>
    <p><strong>{{ edition.meta.type }}</strong></p>
    <p><i>{{ edition.priceInEther }} ETH</i></p>
    <p>Owner: {{ edition.owner }}</p>

    <!-- TODO is this the correct way to hide stuff? -->
    <router-link
      :class="{'hide' : hideBuyButton }"
      :to="{
        name: 'purchaseEdition',
        params: {
          edition: edition.edition
        }
      }" tag="button" class="btn">Buy Now
    </router-link>
  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'

  export default {
    name: 'edition',
    props: {
      edition: Object,
      count: Number,
      hideBuyButton: {
        default: false,
        type: [Boolean]
      },
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

  .hide {
    display: none;
  }
</style>
