<template>
  <div id="details">
    <h1><router-link :to="{ name: 'dashboard' }" class="back-arrow">&lt;</router-link> KODA smart contract</h1>

    <h2>
      Contract address:
      <address-icon :eth-address="contractAddress"></address-icon>
    </h2>

    <div v-if="contractName && contractSymbol" class="message is-primary">
        <p>Symbol {{ contractSymbol }}</p>
    </div>

    <div v-if="curatorAddress" class="message is-primary">
        <p>
          Curator:
          <address-icon :eth-address="curatorAddress"></address-icon>
        </p>
        <p>
          Commission:
          <address-icon :eth-address="commissionAddress"></address-icon>
        </p>
        <p>
          Smart contract partner:
          <address-icon :eth-address="contractDeveloperAddress"></address-icon>
        </p>
    </div>

    <div v-if="totalSupply" class="message is-primary">
      <p>Total supply of assets: {{ totalSupply }}</p>
    </div>

    <div v-if="totalPurchaseValueInWei && totalNumberOfPurchases && totalPurchaseValueInEther" class="message is-primary">
      <p>Number of sales: {{ totalNumberOfPurchases }}</p>
      <p>Purchase total in ETH: {{ totalPurchaseValueInEther }}</p>
    </div>

  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex';
  import AddressIcon from '../ui-controls/AddressIcon';

  export default {
    name: 'dashboard',
    components: {AddressIcon},
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
        'contractAddress'
      ])
    }
  };
</script>

<style scoped>

</style>
