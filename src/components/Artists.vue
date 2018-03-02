<template>
  <div class="artists">
    <h1>{{ title }}</h1>

    <!--{{assets}}-->

    <div v-for="artist in artists">
      <artist :artist="artist"></artist>
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
