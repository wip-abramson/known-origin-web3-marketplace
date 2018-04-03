<template>
  <p class="price centered">Price {{ value }} ETH</p>
</template>

<script>
  export default {
    name: 'priceInEth',
    props: {
      value: {
        type: String
      }
    }
  };
</script>

<style scoped>
  .price {
    font-weight: bold;
    text-align: center;
  }
</style>
