<template>
  <div class="centered">

    <router-link :to="{ name: 'dashboard' }" class="back-arrow" style="float: left">
      <img src="../../../static/back_arrow.svg" style="width: 35px"/>
    </router-link>

    <artist-short-bio :artist="lookupArtist()"></artist-short-bio>

    <div class="centered">
      <section class="cards">
        <galleryEdition
          v-for="assetEdition, key in lookupAssetsByArtistCode($route.params.artistCode)"
          :edition="assetEdition[0]"
          :key="key">
        </galleryEdition>
      </section>
    </div>
  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import ArtistShortBio from '../ui-controls/ArtistShortBio';
  import Asset from '../Asset';
  import GalleryEdition from '../GalleryEdition';

  export default {
    name: 'artistPage',
    components: {ArtistShortBio, GalleryEdition},
    computed: {
      ...mapGetters(['lookupAssetsByArtistCode'])
    },
    methods: {
      lookupArtist: function () {
        return this.$store.getters.findArtist(this.$route.params.artistCode);
      }
    }
  };
</script>

<style scoped>
</style>
