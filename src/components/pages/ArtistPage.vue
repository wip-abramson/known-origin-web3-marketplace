<template>
  <div class="artist">
    <h1>Artist Page</h1>

    <div class="centered">
      <artist :artist="lookupArtist()"></artist>
    </div>

  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import Artist from '../Artist';

  export default {
    name: 'artistPage',
    components: {Artist},
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
