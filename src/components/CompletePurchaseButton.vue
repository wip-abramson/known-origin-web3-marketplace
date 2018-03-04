<template>
  <div class="complete_purchase_container">
    <form>
      <p>
        <input type="checkbox"
               :id="'confirm_terms_' + editionType"
               v-model="confirm_terms">
        <label :for="'confirm_terms_' + editionType">I confirm that I have read the T&C's blah blah blah blah</label>
      </p>
      <p>
        <button type="button" :disabled="!confirm_terms" v-on:click="completePurchase()">Purchase with Ether</button>
      </p>
    </form>
  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'
  import _ from 'lodash'

  export default {
    name: 'completePurchaseButton',
    components: {},
    data() {
      return {
        confirm_terms: false
      }
    },
    computed: {
      ...mapGetters([]),
      ...mapState([]),
    },
    props: {
      editionType: {
        require: true,
        type: String
      },
      editions: {
        require: true,
        type: Array
      },
    },
    mounted() {

    },
    methods: {
      completePurchase: () => {
        console.log("Launch meta mask")
      }
    }
  }
</script>

<style scoped>

</style>
