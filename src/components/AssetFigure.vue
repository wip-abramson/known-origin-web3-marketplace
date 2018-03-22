<template>
  <figure class="thumbnail">
    <img :src="edition.lowResImg"/>
    <span class="edition-type">{{ edition.type }} artwork</span>
    <span class="edition-sold-out" v-if="!isAsset && availableAssetsForEdition(edition.edition).length == 0">SOLD OUT</span>
    <span class="edition-sold" v-if="isAsset && edition.purchased != 0">SOLD</span>
    <span class="edition-run">1 of {{assetsForEdition(edition.edition).length}}</span>

  </figure>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';

  export default {
    name: 'assetFigure',
    props: ['edition', 'isAsset'],
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
