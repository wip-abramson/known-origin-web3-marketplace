<template>
  <div class="centered">
    <artist-short-bio :artist="lookupArtist()"></artist-short-bio>
  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import ArtistShortBio from '../ui-controls/ArtistShortBio';

  export default {
    name: 'artistPage',
    components: {ArtistShortBio},
    computed: {},
    methods: {
      lookupArtist: function () {
        return this.$store.getters.findArtist(this.$route.params.id);
      }
    }
  };
</script>

<style scoped>
</style>
