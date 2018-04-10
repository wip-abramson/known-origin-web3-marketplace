<template>
  <span>
    <figure class="thumbnail">
      <span class="edition-type">{{ edition.type }} artwork</span>
      <img :src="edition.lowResImg"/>
    </figure>
    <div class="edition-run-container">
      <span class="edition-run" v-if="!isAsset"><strong>1 of {{assetsForEdition(edition.edition).length}}</strong></span>
    </div>

    <div v-if="isAsset && edition.purchased != 0 || !isAsset && availableAssetsForEdition(edition.edition).length == 0">
        <h3 class="text-danger text-center">SOLD</h3>
    </div>
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
  .edition-run-container {
    padding-top: 3px;
    padding-left: 5px;
  }

  h3 {
    padding-bottom: 0px;
    margin-bottom: 0px;
  }
</style>
