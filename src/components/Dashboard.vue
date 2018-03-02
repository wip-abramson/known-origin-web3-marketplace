<template>
  <div class="dashboard">

    <div id="splash">
      <h1>{{ title }}</h1>
      <p>Buy original artwork and rare digital assets</p>
      <button class="btn">View gallery</button>
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

  export default {
    name: 'dashboard',
    components: {Artist},
    data() {
      return {
        title: 'Be original. Buy original.',
      }
    },
    computed: {
      ...mapState([
        'totalPurchaseValueInWei',
        'totalNumberOfPurchases',
        'totalPurchaseValueInEther',
        'artists',
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

  .btn {
    background: #3e27d9;
    color: #ffffff;
    font-size: 20px;
    padding: 10px 20px 10px 20px;
    text-decoration: none;
  }

  .btn:hover {
    background: #3e27d9;
    text-decoration: none;
  }
</style>
