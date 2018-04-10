<template>
  <div id="gallery">
   <router-link :to="{ name: 'dashboard' }" class="back-arrow" style="float: left">
     <img src="../../../static/back_arrow.svg" style="width: 35px"/>
   </router-link>

    <h1>Gallery</h1>

    <div class="text-center text-blue" v-if="assetsByEditions.length == 0">
      <img src="../../../static/Timer.svg" style="width: 100px"/><br/>
      <span class="loading">Loading...</span>
    </div>

    <div v-if="assetsByEditions">
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
