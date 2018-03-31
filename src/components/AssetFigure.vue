<template>
  <span>
    <figure class="thumbnail">
      <img :src="edition.lowResImg"/>
      <span class="edition-type" v-if="!isAsset">{{ edition.type }} artwork</span>
      <span class="edition-sold-out" v-if="!isAsset && availableAssetsForEdition(edition.edition).length == 0">SOLD</span>
      <span class="edition-sold" v-if="!isAsset && edition.purchased != 0">SOLD</span>
    </figure>
    <span class="edition-run" v-if="!isAsset">1 of {{assetsForEdition(edition.edition).length}}</span>
  </span>
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
