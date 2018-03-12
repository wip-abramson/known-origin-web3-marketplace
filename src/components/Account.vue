<template>
  <div id="account">
    <h1>{{ title }}</h1>
    <p>{{ account }}<br/> {{ accountBalance }} ETH</p>

    <h2>Purchased assets</h2>

    <p>{{ assetsPurchasedByAccount.length }} Purchased</p>

    <div class="centered">
      <section class="cards">
        <edition v-for="tokenId, key in assetsPurchasedByAccount"
                 :edition="assetById(tokenId)"
                 :edition-is-purchased="true"
                 :hide-buy-button="true"
                 :key="key" >
        </edition>
      </section>
    </div>

  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex'
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
