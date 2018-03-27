<template>
  <div id="gallery">
    <h1><router-link :to="{ name: 'dashboard' }" class="back-arrow">&lt;</router-link> Gallery</h1>

    <div class="centered">
      <section class="cards centered">
        <galleryEdition
          v-for="assetEdition, key in assetsByEditions"
          :edition="assetEdition[0]"
          :key="key">
        </galleryEdition>
      </section>
    </div>

  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex';
  import GalleryEdition from '../GalleryEdition';

  export default {
    name: 'gallery',
    components: {GalleryEdition},
    computed: {
      ...mapState([
        'assetsByEditions'
      ])
    }
  };
</script>

<style scoped>

</style>
