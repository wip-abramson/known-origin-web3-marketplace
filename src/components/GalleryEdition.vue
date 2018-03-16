<template>
  <article class="card" v-if="edition">
    <a href="#">
      <figure class="thumbnail">
        <img :src="edition.lowResImg"/>
      </figure>
      <div class="card-content">

        <h2>{{ edition.editionName }}</h2>

        <p>{{ edition.edition }}</p>

        <p><strong>{{ edition.type }}</strong></p>

        <p><i>{{ edition.priceInEther }} ETH</i></p>

        <p>1 of {{assetsForEdition(edition.edition).length}}</p>
        <p>{{availableAssetsForEdition(edition.edition).length}} available</p>

        <router-link
          :to="{ name: 'confirmPurchase', params: { edition: edition.edition}}"
          tag="button" class="btn">
          View Details
        </router-link>

      </div>
    </a>
    <!-- .card-content -->
  </article>

</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import _ from 'lodash';

  export default {
    name: 'galleryEdition',
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
  .purchased {
    background-color: cornflowerblue;
  }
</style>
