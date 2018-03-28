<template>
  <div id="gallery">
   <router-link :to="{ name: 'dashboard' }" class="back-arrow" style="float: left">
     <img src="../../../static/back_arrow.svg" style="width: 50px"/>
   </router-link>

    <h1>Gallery</h1>

    <div class="">
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
