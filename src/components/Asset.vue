<template>
  <article class="card" v-if="asset">
    <a href="#">
      <figure class="thumbnail">
        <img :src="asset.lowResImg"/>
      </figure>
      <div class="card-content">

        <h2>{{ asset.assetName }}</h2>

        <purchase-state :state="asset.purchased"></purchase-state>

        <p>TOKEN ID {{asset.id}}</p>

        <p>{{ asset.asset }}</p>

        <p>
          Owner: {{ asset.owner }} <br />
          <address-icon :eth-address="asset.owner" :size="'small'"></address-icon>
        </p>

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
  import PurchaseState from './utils/PurchaseState.vue';
  import AddressIcon from './utils/AddressIcon.vue';

  export default {
    components: {AddressIcon, PurchaseState},
    name: 'asset',
    props: {
      asset: {
        type: Object
      },
    },
    computed: {
      ...mapGetters([]),
    }
  };
</script>

<style scoped>

</style>
