<template>
  <article class="card" v-if="asset">
    <a href="#">
      <figure class="thumbnail">
        <img :src="asset.lowResImg"/>
      </figure>
      <div class="card-content">

        <h2>{{ asset.assetName }}</h2>

        <p class="purchased">{{ purchasedState(asset.purchased) }}</p>

        <p>TOKEN ID {{asset.id}}</p>

        <p>{{ asset.asset }}</p>

        <p>Owner: {{ asset.owner }}</p>

        <p>{{ asset.otherMeta.description }}</p>

        <p><strong>{{ asset.type }}</strong></p>

        <p><i>{{ asset.priceInEther }} ETH</i></p>

      </div>
    </a>
    <!-- .card-content -->
  </article>

</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import _ from 'lodash';

  export default {
    name: 'asset',
    props: {
      asset: {
        type: Object
      },
    },
    computed: {
      ...mapGetters([]),
    },
    methods: {
      purchasedState: (purchasedId) => {
        switch (purchasedId) {
          case 0:
            return 'AVAILABLE';
          case 1:
            return 'SOLD CRYPTO';
          case 2:
            return 'SOLD FIAT';
          default:
            return 'ERRRR...';
        }
      }
    }
  };
</script>

<style scoped>
  .purchased {
    background-color: cornflowerblue;
  }
</style>
