<template>
  <article class="card" v-if="edition">
    <a href="#">
      <figure class="thumbnail">
        <img :src="edition.lowResImg"/>
        <span class="edition-type">{{ edition.type }} artwork</span>
        <span class="edition-run">1 of {{assetsForEdition(edition.edition).length}}</span>
      </figure>
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

  export default {
    name: 'galleryEdition',
    components: {PriceInEth},
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
  .thumbnail {
    position: relative;
  }

  .edition-type {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #3e27d9;
    color: #f2f2f2;
    padding: 10px;
    opacity: 0.8;
  }

  .edition-run {
    background-color: gray;
    color: #f2f2f2;
    padding: 5px;
  }

  .edition-code {
    font-size: 0.85em;
    padding: 0px;
  }

  .price {
    font-weight: bold;
    font-size: 1.25em;
    text-align: center;
  }

  .muted {
    color: gray;
  }

  .btn-center {
    text-align: center;
  }
</style>
