<template>
  <div id="gallery">
    <h1>{{ title }}</h1>

    <div v-for="assetEdition in assetsByEditions">
      <div class="edition-tile">
        <p><strong>{{ assetEdition[0].edition }}</strong> <span style="float: right">1 of {{ assetEdition.length }}</span></p>
        <img src="https://picsum.photos/400/400"/>
        <p>{{ assetEdition[0].meta.artist_name }}</p>
        <p>{{ assetEdition[0].meta.type }}</p>
        <p><i>{{ assetEdition[0].priceInWei }}</i></p>
      </div>
    </div>

  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex'

  export default {
    name: 'gallery',
    components: {},
    data() {
      return {
        title: 'Gallery',
      }
    },
    computed: {
      ...mapState([
        'assetsByEditions'
      ])
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  a {
    color: #42b983;
  }
  
  .edition-tile {
    text-align: center;
    padding: 10px;
    margin: 5px;
    border: 1px solid gray;
  }
</style>
