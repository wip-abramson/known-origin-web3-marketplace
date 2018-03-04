<template>
  <div id="gallery">
    <h1>{{ title }}</h1>

    <div v-for="assetEdition in assetsByEditions" class="edition-wrap">
      <!-- TODO this needs to take in the list so we can display prices for all types physical/digital -->
      <edition :edition="assetEdition[0]" :count="assetEdition.length"></edition>
    </div>

  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex'
  import Edition from './Edition'

  export default {
    name: 'gallery',
    components: {Edition},
    data() {
      return {
        title: 'Gallery',
      }
    },
    computed: {
      ...mapState([
        'assetsByEditions'
      ])
    }
  }
</script>

<style scoped>
  .edition-wrap {
    padding-bottom: 20px;
  }
</style>
