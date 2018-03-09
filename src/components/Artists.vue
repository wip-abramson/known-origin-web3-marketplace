<template>
  <div class="artists">
    <h1>{{ title }}</h1>

    <div class="centered">
      <section class="cards">
        <artist v-for="artist in artists" :key="artist.name" :artist="artist"></artist>
      </section>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'
  import Artist from './Artist'

  export default {
    name: 'artists',
    components: {Artist},
    data() {
      return {
        title: 'Artists',
      }
    },
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

<style scoped>

</style>
