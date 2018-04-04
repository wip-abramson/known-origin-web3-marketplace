<template>
  <div id="details">
    <router-link :to="{ name: 'dashboard' }" class="back-arrow" style="float: left">
      <img src="../../../static/back_arrow.svg" style="width: 50px"/>
    </router-link>

    <h1>KODA smart contract</h1>

    <h2 v-if="contractAddress">
      Contract address:
      <clickable-address :eth-address="contractAddress"></clickable-address>
    </h2>

    <table>
      <tr v-if="contractSymbol">
        <td>Symbol</td>
        <td>{{ contractSymbol }}</td>
      </tr>
      <tr v-if="curatorAddress">
        <td>Curator</td>
        <td>
          <clickable-address :eth-address="curatorAddress"></clickable-address>
        </td>
      </tr>
      <tr v-if="contractDeveloperAddress">
        <td>Developer:</td>
        <td>
          <clickable-address :eth-address="contractDeveloperAddress"></clickable-address>
        </td>
      </tr>
      <tr v-if="totalSupply">
        <td>Supply:</td>
        <td>{{ totalSupply }}</td>
      </tr>
      <tr v-if="totalNumberOfPurchases">
        <td>Sales</td>
        <td>{{ totalNumberOfPurchases }}</td>
      </tr>
      <tr v-if="totalPurchaseValueInEther">
        <td>Total</td>
        <td>{{ totalPurchaseValueInEther }}</td>
      </tr>
    </table>

  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';
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
  td {
    padding: 20px;
  }
</style>
