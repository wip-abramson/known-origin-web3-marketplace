<template>
  <div class="assets_to_buy">
    <h1>{{ title }}</h1>

    <div class="centered" v-if="edition">
      <section>
        <edition :edition="edition"></edition>
      </section>

      <confirm-purchase-button :edition="edition"></confirm-purchase-button>
    </div>

  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import Artist from '../Artist';
  import Edition from '../Edition';
  import ConfirmPurchaseButton from '../ui-controls/ConfirmPurchaseButton';
  import _ from 'lodash';

  export default {
    name: 'confirmPurchase',
    components: {Edition, ConfirmPurchaseButton},
    data () {
      return {};
    },
    computed: {
      ...mapGetters([
        'firstAssetForEdition'
      ]),
      title: function () {
        return `Buying Edition ${this.$route.params.edition}`;
      },
      edition: function () {
        return this.firstAssetForEdition(this.$route.params.edition);
      }
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

</style>
