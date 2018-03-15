<template>
  <div class="complete_purchase_container">
    <form>
      <p>
        <input type="checkbox" :id="'confirm_terms'" v-model="confirm_terms">
        <label :for="'confirm_terms'">I agree with KODA license</label>
      </p>
      <p>
        <router-link :to="{ name: 'license' }">Read license</router-link>
      </p>
      <p>
        <button type="button" :disabled="!confirm_terms" v-on:click="confirmPurchase" class="btn">
          Confirm
        </button>
      </p>
    </form>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import _ from 'lodash';
  import * as actions from '../../store/actions';

  export default {
    name: 'confirmPurchaseButton',
    components: {},
    props: {
      edition: {
        required: true,
        type: Object
      },
    },
    computed: {
      ...mapGetters(['isCurator']),
    },
    data () {
      return {
        confirm_terms: false
      };
    },
    methods: {
      confirmPurchase: function () {

        let editions = this.$store.getters.assetsForEdition(this.edition.edition);

        let nextAssetToPurchase = _.chain(editions)
          .orderBy('editionNumber')
          .filter({purchased: 0})
          .head()
          .value();

        console.log('confirming purchase');
        console.log(nextAssetToPurchase);

        this.$router.push({
          name: 'completePurchase',
          params: {
            edition: nextAssetToPurchase.edition,
            tokenId: nextAssetToPurchase.id
          }
        });
      }
    }
  };
</script>

<style scoped>

  .btn-warning {
    background-color: darkorange;
  }
</style>
