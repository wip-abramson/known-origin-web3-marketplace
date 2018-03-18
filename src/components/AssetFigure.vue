<template>
  <figure class="thumbnail">
    <img :src="edition.lowResImg"/>
    <span class="edition-type">{{ edition.type }} artwork</span>
    <span class="edition-run">1 of {{assetsForEdition(edition.edition).length}}</span>
  </figure>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';

  export default {
    name: 'assetFigure',
    props: ['edition'],
    computed: {
      ...mapGetters([
        'assetsForEdition'
      ]),
    }
  };
</script>

<style scoped>
  .thumbnail {
    position: relative;
  }

  .edition-type {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #3e27d9;
    color: #f2f2f2;
    padding: 10px;
    opacity: 0.8;
  }

  .edition-run {
    background-color: gray;
    color: #f2f2f2;
    padding: 5px;
  }
</style>
