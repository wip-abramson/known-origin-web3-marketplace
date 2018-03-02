<template>
  <div class="dashboard">
    <h1>{{ msg }}</h1>

    <div v-if="curatorAddress" class="message is-primary">
      <div class="message-header">
        <p>Addresses: </p>
      </div>
      <div class="message-body">
        curatorAddress = {{ curatorAddress }} commissionAddress = {{ commissionAddress }} contractDeveloperAddress = {{ contractDeveloperAddress }}
      </div>
    </div>
    <div v-if="totalSupply" class="message is-primary">
      <div class="message-header">
        <p>totalSupply:</p>
      </div>
      <div class="message-body">
        {{ totalSupply }}
      </div>
    </div>
    <div v-if="totalPurchaseValueInWei && totalNumberOfPurchases && totalPurchaseValueInEther" class="message is-primary">
      <div class="message-header">
        <p>totals:</p>
      </div>
      <div class="message-body">
        totalPurchaseValueInWei = {{ totalPurchaseValueInWei }} |
        totalNumberOfPurchases = {{ totalNumberOfPurchases }} |
        totalPurchaseValueInEther = {{ totalPurchaseValueInEther }}
      </div>
    </div>
    <div v-if="contractName && contractSymbol" class="message is-primary">
      <div class="message-header">
        <p>totals:</p>
      </div>
      <div class="message-body">
        contractName = {{ contractName }} | contractSymbol = {{ contractSymbol }}
      </div>
    </div>

    <div class="gallery">

    </div>

    <router-link :to="{ name: 'artists' }">Artists</router-link>
  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex'

  export default {
    name: 'dashboard',
    data() {
      return {
        msg: 'Digital arts festival',
      }
    },
    computed: {
      ...mapState([
        'curatorAddress',
        'contractDeveloperAddress',
        'commissionAddress',
        'totalSupply',
        'totalPurchaseValueInWei',
        'totalNumberOfPurchases',
        'totalPurchaseValueInEther',
        'contractName',
        'contractSymbol',
      ])
    },
    beforeCreate: function () {

    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    display: block;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
