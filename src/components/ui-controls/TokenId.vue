<template>
  <span class="token-id">{{ pad }}</span>
</template>

<script>
  export default {
    name: 'tokenId',
    props: ['value'],
    computed: {
      pad: function () {
        let s = '' + this.value;
        while (s.length < 6) s = "0" + s;
        return '#' + s;
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
