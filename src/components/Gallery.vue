<template>
  <div id="gallery">
    <h1>{{ title }}</h1>

    <div v-for="assetEdition in assetsByEditions">
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
