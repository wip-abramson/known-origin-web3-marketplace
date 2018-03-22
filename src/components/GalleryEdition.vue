<template>
  <article class="card" v-if="edition">
    <div>
      <asset-figure :edition="edition"></asset-figure>
      <div class="card-content">

        <edition-name-by-artist :edition="edition"></edition-name-by-artist>

        <p class="muted">
          {{ availableAssetsForEdition(edition.edition).length }} available
        </p>

        <price-in-eth :value="edition.priceInEther"></price-in-eth>

        <p class="btn-center">
          <router-link
            :to="{ name: 'confirmPurchase', params: { edition: edition.edition }}"
            tag="button" class="btn btn-center">
            View details
          </router-link>
        </p>

      </div>
    </div>
    <!-- .card-content -->
  </article>

</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import _ from 'lodash';
  import PriceInEth from './ui-controls/PriceInEth.vue';
  import EditionNameByArtist from './ui-controls/EditionNameByArtist.vue';
  import AssetFigure from './AssetFigure.vue';

  export default {
    name: 'galleryEdition',
    components: {PriceInEth, AssetFigure, EditionNameByArtist},
    props: {
      edition: {
        required: true,
        type: Object
      },
    },
    computed: {
      ...mapGetters([
        'assetsForEdition',
        'availableAssetsForEdition',
      ]),
    },
    methods: {
      countPurchased: (assets) => {
        return _.filter(assets, (val) => {
          return val.purchased === 1 || val.purchased === 2;
        });
      },
      countAvailable: (assets) => {
        return _.filter(assets, {'purchased': 0});
      }
    }
  };
</script>

<style scoped>
</style>
