<template>
  <div id="details">
    <h1>{{ title }}</h1>

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
  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex'

  export default {
    name: 'dashboard',
    data() {
      return {
        title: 'Contract stuff',
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
    }
  }
</script>

<style scoped>
  a {
    color: #42b983;
  }
</style>
