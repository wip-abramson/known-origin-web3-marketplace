<template>
  <div :class="'icon-' + size" v-if="ethAddress">
    <img :src="'data:image/png;base64,' + createIcon">
  </div>
</template>

<script>
  /* global web3:true */
  import Identicon from 'identicon.js';

  export default {
    name: 'addressIcon',
    props: {
      ethAddress: {
        type: String
      },
      size: {
        type: String,
        default: 'normal'
      }
    },
    computed: {
      createIcon: function () {
        return new Identicon(this.ethAddress, 420).toString();
      }
    }
  };
</script>

<style>
  .icon-normal {
    height: 64px;
    width: 64px;
  }

  .icon-small {
    height: 32px;
    width: 32px;
  }
</style>
