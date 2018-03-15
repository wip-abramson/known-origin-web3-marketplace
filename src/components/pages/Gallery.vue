<template>
  <div id="gallery">
    <h1>{{ title }}</h1>

    <div class="centered">
      <section class="cards">
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
    data() {
      return {
        title: 'Gallery',
      };
    },
    computed: {
      ...mapState([
        'assetsByEditions'
      ])
    }
  };
</script>

<style scoped>

</style>
