<template>
  <div class="centered">
    <artist-short-bio :artist="lookupArtist()"></artist-short-bio>

    <div class="centered">
      <section class="cards" v-if="assetsByArtistCode">
        <asset v-for="asset, key in lookupAssetsByArtistCode()" :asset="asset" :key="key">
        </asset>
      </section>
    </div>
    {{  }}
  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import ArtistShortBio from '../ui-controls/ArtistShortBio';
  import Asset from '../Asset';

  export default {
    name: 'artistPage',
    components: {ArtistShortBio, Asset},
    computed: {
      ...mapState(['assetsByArtistCode'])
    },
    methods: {
      lookupArtist: function () {
        return this.$store.getters.findArtist(this.$route.params.id);
      },
      lookupAssetsByArtistCode: function () {
        return this.assetsByArtistCode[this.$route.params.id];
      }
    }
  };
</script>

<style scoped>
</style>
