<template>
  <article class="card" v-if="edition">
    <a href="#">
      <figure class="thumbnail">
        <img :src="edition.lowResImg"/>
      </figure>
      <div class="card-content">

        <h2>{{ edition.meta.artworkName }}</h2>

        <p v-if="!editionIsPurchased">
          Available {{ countAvailable(assetsForEdition(edition.edition)).length }} |
          Purchased {{ countPurchased(assetsForEdition(edition.edition)).length }}
        </p>

        <p v-if="editionIsPurchased">TOKEN ID {{edition.id}}</p>

        <p>{{ edition.edition }}</p>

        <p v-if="editionIsPurchased">Owner: {{ edition.owner }}</p>

        <p>{{ edition.ipfsMeta.description }}</p>

        <p><strong>{{ edition.meta.type }}</strong></p>

        <p><i>{{ edition.priceInEther }} ETH</i></p>

        <div v-if="!hideBuyButton">
          <router-link
            :to="{ name: 'purchaseEdition', params: { edition: edition.edition}}"
            tag="button"
            class="btn">
            Buy
          </router-link>
        </div>

      </div>
    </a>
    <!-- .card-content -->
  </article>

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

</style>
