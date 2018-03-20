<template>
  <figure class="thumbnail">
    <img :src="edition.lowResImg"/>
    <span class="edition-type">{{ edition.type }} artwork</span>
    <span class="edition-sold" v-if="availableAssetsForEdition(edition.edition).length == 0">SOLD</span>
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
        'assetsForEdition',
        'availableAssetsForEdition'
      ]),
    }
  };
</script>

<style scoped>

</style>
