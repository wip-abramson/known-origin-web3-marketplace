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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  a {
    color: #42b983;
  }

  #splash, #featured-artists {
    text-align: center;
    padding: 10px;
    margin: 5px;
  }
</style>
