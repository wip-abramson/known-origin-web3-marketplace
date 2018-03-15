<template>
  <div id="dashboard">

    <div id="splash">
      <h1>{{ title }}</h1>
      <h2>Buy original artwork and rare digital assets</h2>
      <router-link :to="{ name: 'gallery' }" tag="button" class="btn">View gallery</router-link>
    </div>

    <div id="featured-artists">
      <h2>Featured artists</h2>
      <div class="centered">
        <section class="cards">
            <artist v-for="artist in featuredArtists" :artist="artist" :key="artist.name"></artist>
        </section>
        <h3>More artists and workshops to be announced...</h3>
      </div>
    </div>

    <div id="quote">
      <p>Can we use the power of Ethereum blockchain and the integrity of digital assets in the art world to improve the proof of ownership, provenance, authenticity and reducing forgery of artwork?</p>
    </div>

    <div id="partners">
      <h2>Our partners</h2>
      <img src="../assets/Partner_Footer2.png" style="max-width: 100%"/>
    </div>
  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex';
  import Artist from './Artist';
  import Gallery from './Gallery';

  export default {
    name: 'dashboard',
    components: {Artist, Gallery},
    data() {
      return {
        title: 'Be original. Buy original.',
      };
    },
    computed: {
      ...mapGetters([
        'featuredArtists'
      ])
    }
  };
</script>

<style scoped>
  #splash, #partners, #quote {
    text-align: center;
    margin: 5px;
  }

  #quote {
    text-align: left;
    font-size: 18px;
    font-weight: bold;
    padding: 25px;
  }
</style>
