<template>
  <div class="eth-icon" v-if="ethAddress">
    <img :src="'data:image/png;base64,' + createIcon">
  </div>
</template>

<script>
  /* global web3:true */
  import Identicon from 'identicon.js';

  export default {
    name: 'addressIcon',
    props: ['ethAddress'],
    computed: {
      createIcon: function () {
        console.log('eth address', this.ethAddress);
        return new Identicon(this.ethAddress, 420).toString();
      }
    }
  };
</script>

<style>
  .eth-icon {
    height: 128px;
    width: 128px;
  }

</style>
