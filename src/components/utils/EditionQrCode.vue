<template>
  <div v-if="edition">
    <a v-on:click="showQr = !showQr">{{showQr ? 'Hide' : 'Show'}} QR Code</a>
    <div v-if="showQr">
      <h4>#{{ edition.edition }}</h4>
      <img :src="generateQrCode" alt="qrcode"/>
    </div>
  </div>
</template>

<script>
  /* global web3:true */
  import QRCode from 'qrcode';

  export default {
    name: 'editionQrCode',
    props: {
      edition: {
        type: Object,
        required: true
      },
    },
    data () {
      return {
        showQr: false
      };
    },
    asyncComputed: {
      generateQrCode: function () {
        return QRCode.toDataURL(window.location.href, {
          margin: 2,
        });
      }
    }
  };
</script>

<style>

</style>
