<template>
  <div id="account">
    <h1>{{ title }}</h1>
    <p><i>{{ account }}</i></p>
    <p><i>{{ accountBalance }} ETH</i></p>
    <p><i>{{ assetsPurchasedByAccount }} token IDS purchased</i></p>

    <h2>Purchased assets</h2>
  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex'
  import Artist from './Artist'
  import Gallery from './Gallery'

  export default {
    name: 'dashboard',
    components: {},
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
      ])
    },
    mounted() {

    }
  }
</script>

<style scoped>
</style>
