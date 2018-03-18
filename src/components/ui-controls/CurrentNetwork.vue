<template>
  <div class="current-network">
    {{ currentNetwork }}
  </div>
</template>

<script>
  /* global web3:true */

  import Web3 from 'web3';
  import {mapState} from 'vuex';

  export default {
    name: 'currentNetwork',
    computed: {
      ...mapState(['currentNetwork']),
    },
  };
</script>

<style>
  .current-network {
    font-size: 12px;
  }

</style>
