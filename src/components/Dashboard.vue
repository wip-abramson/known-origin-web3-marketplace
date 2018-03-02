<template>
  <div id="dashboard">

    <div id="splash">
      <h1>{{ title }}</h1>
      <p>Buy original artwork and rare digital assets</p>
      <router-link :to="{ name: 'gallery' }" tag="button" class="btn">View gallery</router-link>
    </div>

    <div id="featured-artists">
      <h2>Featured artists</h2>
      <div v-for="artist in artists">
        <artist :artist="artist"></artist>
      </div>
      <p>More artists and workshops to be announced...</p>
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

  import {mapGetters, mapState} from 'vuex'
  import Artist from './Artist'
  import Gallery from './Gallery'

  export default {
    name: 'dashboard',
    components: {Artist, Gallery},
    data() {
      return {
        title: 'Be original. Buy original.',
      }
    },
    computed: {
      ...mapState([
        'artists'
      ])
    }
  }
</script>

<style scoped>
  a {
    color: #42b983;
  }

  #splash, #featured-artists, #partners, #quote {
    text-align: center;
    padding: 10px;
    margin: 5px;
  }

  #quote {
    text-align: left;
    font-size: 18px;
    font-weight: bold;
    padding: 10px;
    margin: 50px;
  }
</style>
