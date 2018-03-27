<template>
  <article class="card" v-if="edition">
    <div>
      <asset-figure :edition="edition"></asset-figure>
      <div class="card-content">

        <edition-name-by-artist :edition="edition"></edition-name-by-artist>

        <p class="muted">
          {{ availableAssetsForEdition(edition.edition).length }} available
        </p>

        <p v-if="purchase">
          <strong>Artwork description</strong><br/>
          {{ edition.otherMeta.description }}
        </p>

        <hr/>

        <price-in-eth :value="edition.priceInEther"></price-in-eth>

        <p v-if="!purchase">
          <router-link :to="{ name: 'confirmPurchase', params: { artistCode: edition.edition.substring(0, 3), edition: edition.edition }}" class="btn">
            View details
          </router-link>
        </p>

        <confirm-purchase-button :edition="edition" class="btn-center" v-if="purchase"></confirm-purchase-button>
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
  import ConfirmPurchaseButton from './ui-controls/ConfirmPurchaseButton';
  import AssetFigure from './AssetFigure.vue';

  export default {
    name: 'galleryEdition',
    components: {PriceInEth, AssetFigure, EditionNameByArtist, ConfirmPurchaseButton},
    props: {
      edition: {
        required: true,
        type: Object
      },
      purchase: {
        type: Boolean
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
