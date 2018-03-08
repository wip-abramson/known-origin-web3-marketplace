<template>
  <div id="account" class="centered">
    <h1>{{ title }}</h1>
    <p><i>{{ account }}</i></p>
    <p><i>{{ accountBalance }} ETH</i></p>
    <p><i>{{ assetsPurchasedByAccount.length }} Purchased</i></p>


    <div id="purchased-assets">
      <h2>Purchased assets</h2>
      <section class="cards">
        <div v-for="tokenId in assetsPurchasedByAccount">
          <edition :edition="assetById(tokenId)"
                   :edition-is-purchased="true"
                   :hide-buy-button="true">
          </edition>
        </div>
      </section>
    </div>

  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex'
  import Artist from './Artist'
  import Gallery from './Gallery'
  import Edition from './Edition'

  export default {
    name: 'dashboard',
    components: {Edition},
    data() {
      return {
        title: 'Account',
      }
    },
    computed: {
      ...mapState([
        'account',
        'accountBalance',
        'assetsPurchasedByAccount',
      ]),
      ...mapGetters([
        'assetById',
      ])
    },
    mounted() {

    }
  }
</script>

<style scoped>
</style>
