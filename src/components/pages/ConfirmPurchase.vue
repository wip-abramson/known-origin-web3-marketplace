<template>
  <div>
    <h1><router-link :to="{ name: 'gallery' }" class="back-arrow">&lt;</router-link>  {{ edition.editionName }}</h1>
    
    <div class="assets_to_buy centered" v-if="edition">
        <edition :edition="edition"></edition>
        <confirm-purchase-button :edition="edition" class="btn-center"></confirm-purchase-button>
    </div>

    <edition-qr-code :edition="edition"></edition-qr-code>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import Artist from '../Artist';
  import Edition from '../Edition';
  import ConfirmPurchaseButton from '../ui-controls/ConfirmPurchaseButton';
  import _ from 'lodash';
  import EditionQrCode from '../ui-controls/EditionQrCode.vue';

  export default {
    name: 'confirmPurchase',
    components: {EditionQrCode, Edition, ConfirmPurchaseButton},
    computed: {
      ...mapGetters([
        'firstAssetForEdition'
      ]),
      edition: function () {
        return this.firstAssetForEdition(this.$route.params.edition);
      },
      title: function () {
        return `${this.edition.editionName} #${this.edition.edition}`;
      },
    },
    methods: {
      countPurchased: (assets) => {
        return _.filter(assets, (val) => {
          return val.purchased === 1 || val.purchased === 2;
        });
      },
      countAvailable: (assets) => {
        return _.filter(assets, {'purchased': 0});
      },
    }
  };
</script>

<style scoped>
  .assets_to_buy {
    background: white;
    max-width: 400px;
  }
</style>
