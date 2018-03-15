<template>
  <div class="assets_to_buy">
    <h1>{{ title }}</h1>

    <div class="centered" v-if="asset">
      <section>
        <asset :asset="asset"></asset>
      </section>

      <complete-purchase-button :asset="asset"></complete-purchase-button>
    </div>

  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import Artist from '../Artist';
  import Asset from '../Asset';
  import CompletePurchaseButton from '../ui-controls/CompletePurchaseButton';
  import _ from 'lodash';

  export default {
    name: 'completePurchase',
    components: {Asset, CompletePurchaseButton},
    data () {
      return {};
    },
    computed: {
      ...mapGetters([
        'assetsForEdition',
        'firstAssetForEdition'
      ]),
      title: function () {
        return `You are buying ${this.$route.params.edition} - ID ${this.$route.params.tokenId}`;
      },
      asset: function () {
        return this.$store.getters.assetById(this.$route.params.tokenId);
      }
    },
    methods: {}
  };
</script>

<style scoped>

</style>
