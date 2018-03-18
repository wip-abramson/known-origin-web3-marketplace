<template>
  <div class="assets_to_buy">
    <div class="centered" v-if="edition">
      <section>
        <edition :edition="edition">
        </edition>
        <confirm-purchase-button :edition="edition" class="btn-center"></confirm-purchase-button>
      </section>

      <section>
        <edition-qr-code :edition="edition"></edition-qr-code>
      </section>
    </div>
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
      margin-left: 170px;
      margin-right: 170px;
      margin-top: 50px;
      margin-bottom: 50px;
  }

  .btn-center {
    text-align: center;
  }
</style>
