<template>
  <div id="gallery">
    <h1>{{ title }}</h1>

    <div class="centered">
      <section class="cards">
          <div v-for="assetEdition in assetsByEditions">
            <edition :edition="assetEdition[0]" :gallery-view="true">
            </edition>
          </div>
      </section>
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

</style>
