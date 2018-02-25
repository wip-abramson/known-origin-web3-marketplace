<template>
  <div class="dashboard">
    <h1>{{ msg }}</h1>

    <div v-if="curatorAddress" class="message is-primary">
      <div class="message-header">
        <p>curatorAddress: </p>
      </div>
      <div class="message-body">
        {{ curatorAddress }}
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
    <div v-if="totalPurchaseValueInWei && totalNumberOfPurchases " class="message is-primary">
      <div class="message-header">
        <p>totals:</p>
      </div>
      <div class="message-body">
        totalPurchaseValueInWei = {{ totalPurchaseValueInWei }}
        totalNumberOfPurchases = {{ totalNumberOfPurchases }}
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

  </div>
</template>

<script>

  import {mapGetters} from 'vuex'

  export default {
    name: 'dashboard',
    data() {
      return {
        msg: 'Welcome to your truffle-vue dApp',
      }
    },
    computed: {
      curatorAddress() {
        return this.$store.state.curatorAddress;
      },
      totalSupply() {
        return this.$store.state.totalSupply;
      },
      totalPurchaseValueInWei() {
        return this.$store.state.totalPurchaseValueInWei;
      },
      totalNumberOfPurchases() {
        return this.$store.state.totalNumberOfPurchases;
      },
      contractName() {
        return this.$store.state.contractName;
      },
      contractSymbol() {
        return this.$store.state.contractSymbol;
      }
    },
    beforeCreate: function () {

    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
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
