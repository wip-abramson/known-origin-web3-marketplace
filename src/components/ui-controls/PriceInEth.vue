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
    font-size: 1.25em;
    text-align: center;
  }
</style>
