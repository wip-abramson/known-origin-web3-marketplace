<template>
  <article class="card" v-if="edition">
    <a href="#">
      <figure class="thumbnail">
        <img :src="edition.lowResImg"/>
      </figure>
      <div class="card-content">

        <h2>By {{ edition.artist }}</h2>

        <p>{{availableAssetsForEdition(edition.edition).length}} available</p>

        <h4>Description</h4>
        <p>{{ edition.otherMeta.description }}</p>

        <p><strong>{{ edition.type }}</strong></p>

        <p><i>{{ edition.priceInEther }} ETH</i></p>

      </div>
    </a>
    <!-- .card-content -->
  </article>

</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import _ from 'lodash';

  export default {
    name: 'edition',
    props: {
      edition: {
        required: true,
        type: Object
      },
    },
    computed: {
      ...mapGetters([
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
