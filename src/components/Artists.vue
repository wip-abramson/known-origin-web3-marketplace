<template>
  <div class="artists">
    <h1>Artists</h1>


    {{assets}}

    <div class="artist-bio" v-for="artist in artists">
      <h3>{{ artist.name }}</h3>
      <p>{{ artist.bio }}</p>
      <img :src="artist.img"/>
      <artist></artist>
    </div>

    <router-link :to="{ name: 'dashboard' }">Dash</router-link>
  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'
  import Artist from './Artist'

  export default {
    name: 'artists',
    components: {Artist},
    computed: {
      ...mapState([
        'artists',
        'assets',
      ])
    },
    mounted() {

    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .artist-bio {
    padding: 10px;
    margin: 5px;
    border: 1px solid gray;
  }
</style>
