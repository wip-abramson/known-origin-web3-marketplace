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
                       :sync="true" color="#82C7EB" :width="65"
                       @change="onSoldToggleChanged"/>

        <select style="border: thin dashed;" title="price filter" v-model="priceFilter">
          <option value="asc">Low to high</option>
          <option value="desc">High to low</option>
        </select>
      </p>

    </div>

    <hr/>

    <div class="text-center text-blue" v-if="editions.length === 0">
      <img src="../../../static/Timer.svg" style="width: 100px"/><br/>
      <span class="loading">Loading...</span>
    </div>

    <div v-if="editions">
      <section class="cards centered">
        <galleryEdition
          v-for="edition in editions"
          :edition="edition"
          :key="edition.edition">
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
        priceFilter: 'asc'
      };
    },
    methods: {
      onSoldToggleChanged: function ({value}) {
        this.showSold = value;
      }
    },
    computed: {
      ...mapState([
        'editionSummary'
      ]),
      editions: function () {
        return this.$store.getters.editionSummaryFilter(this.showSold, this.priceFilter);
      },
    }
  };
</script>

<style scoped>
</style>
