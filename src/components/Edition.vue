<template>
  <div class="edition-tile" v-if="edition">
    <p>
      {{ edition.meta.artistName }} - <strong>{{ edition.meta.artworkName }}</strong>

      <span v-if="editionIsPurchased || galleryView" style="float: right">
        Available {{ countAvailable(assetsForEdition(edition.edition)).length }} |
        Purchased {{ countPurchased(assetsForEdition(edition.edition)).length }}
      </span>

      <span v-if="editionIsPurchased" style="float: right">TOKEN ID {{edition.id}}</span>
    </p>
    <!--<p>{{ edition.edition }}</p>-->
    <img :src="edition.lowResImg" style="max-width: 400px"/>
    <p v-if="!galleryView">{{ edition.ipfsMeta.description }}</p>
    <p><strong>{{ edition.meta.type }}</strong></p>
    <p><i>{{ edition.priceInEther }} ETH</i></p>

    <p v-if="editionIsPurchased">Owner: {{ edition.owner }}</p>

    <div v-if="!hideBuyButton">
      <router-link
        :to="{
          name: 'purchaseEdition',
          params: {
            edition: edition.edition
          }
        }" tag="button" class="btn">View Details
      </router-link>
    </div>
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
      editionIsPurchased: {
        default: false,
        type: [Boolean]
      },
      galleryView: {
        default: false,
        type: [Boolean]
      },
    },
    computed: {
      ...mapGetters([
        'assetsForEdition',
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
