<template>
  <div id="gallery">
    <router-link :to="{ name: 'dashboard' }" class="back-arrow" style="float: left">
      <img src="../../../static/back_arrow.svg" style="width: 35px"/>
    </router-link>

    <h1>Gallery</h1>

    <hr/>

    <div>
      <p>
        <toggle-button :value="showSold"
                       :labels="{checked: 'Sold', unchecked: 'Unsold'}"
                       :sync="true" color="#82C7EB"
                       :width="65"
                       @change="onSoldToggleChanged"/>
      </p>

      <p>
        <select style="border: thin dashed;" v-model="selectedArtist">
          <option value="">Filter by artist</option>
          <option v-for="artist in artists" v-bind:value="artist.artistCode">
            {{ artist.name }}
          </option>
        </select>
      </p>
    </div>

    <hr/>

    <div class="text-center text-blue" v-if="Object.keys(assets).length === 0">
      <img src="../../../static/Timer.svg" style="width: 100px"/><br/>
      <span class="loading">Loading...</span>
    </div>

    <div v-if="assets">
      <section class="cards centered">
        <galleryEdition
          v-for="assetEdition, key in assets"
          :edition="assetEdition[0]"
          :key="key">
        </galleryEdition>
      </section>
    </div>

  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex';
  import GalleryEdition from '../GalleryEdition';

  export default {
    name: 'gallery',
    components: {
      GalleryEdition
    },
    data() {
      return {
        showSold: false,
        selectedArtist: ''
      };
    },
    methods: {
      onSoldToggleChanged: function ({value}) {
        this.showSold = value;
      }
    },
    computed: {
      ...mapState([
        'artists'
      ]),
      assets: function () {
        return this.$store.getters.assetsByEditionsFilter(this.showSold, this.selectedArtist);
      },
    }
  };
</script>

<style scoped>
</style>
