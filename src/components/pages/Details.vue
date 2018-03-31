<template>
  <div id="details">
    <router-link :to="{ name: 'dashboard' }" class="back-arrow" style="float: left">
      <img src="../../../static/back_arrow.svg" style="width: 50px"/>
    </router-link>

    <h1>KODA smart contract</h1>

    <h2>
      Contract address:
      <clickable-address :eth-address="contractAddress"></clickable-address>
    </h2>

    <div v-if="contractName && contractSymbol" class="message is-primary">
        <p>Symbol {{ contractSymbol }}</p>
    </div>

    <div v-if="curatorAddress" class="message is-primary">
        <p>
          Curator:
          <clickable-address :eth-address="curatorAddress"></clickable-address>
        </p>
        <p>
          Commission:
          <clickable-address :eth-address="commissionAddress"></clickable-address>
        </p>
        <p>
          Smart contract partner:
          <clickable-address :eth-address="contractDeveloperAddress"></clickable-address>
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
  import ClickableAddress from '../ui-controls/ClickableAddress';

  export default {
    name: 'dashboard',
    components: {AddressIcon, ClickableAddress},
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
