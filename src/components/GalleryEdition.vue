<template>
  <article class="card" v-if="edition">
    <a href="#">
      <asset-figure :edition="edition"></asset-figure>
      <div class="card-content">

        <h3>
          {{ edition.editionName }}
          by
          {{ edition.artist }}
        </h3>

        <p class="edition-code">{{ edition.edition }}</p>

        <p class="muted">
          {{availableAssetsForEdition(edition.edition).length}} available
        </p>

        <price-in-eth :value="edition.priceInEther"></price-in-eth>

        <p class="btn-center">
          <router-link
            :to="{ name: 'confirmPurchase', params: { edition: edition.edition}}"
            tag="button" class="btn btn-center">
            View details
          </router-link>
        </p>
      </div>
    </a>
    <!-- .card-content -->
  </article>

</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import _ from 'lodash';
  import PriceInEth from './ui-controls/PriceInEth.vue';
  import AssetFigure from './AssetFigure.vue';

  export default {
    name: 'galleryEdition',
    components: {PriceInEth, AssetFigure},
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
  .edition-code {
    font-size: 0.85em;
    padding: 0px;
  }

  .muted {
    color: gray;
  }

  .btn-center {
    text-align: center;
  }
</style>
