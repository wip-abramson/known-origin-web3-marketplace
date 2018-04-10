<template>
  <div id="account">
    <router-link :to="{ name: 'dashboard' }" class="back-arrow" style="float: left">
      <img src="../../../static/back_arrow.svg" style="width: 35px"/>
    </router-link>

    <h1>Assets <span v-if="assets">({{ assets.length }})</span></h1>

    <div class="text-center text-blue" v-if="assets.length == 0">
      <img src="../../../static/Timer.svg" style="width: 100px"/><br/>
      <span class="loading">Loading...</span>
    </div>

    <div class="centered" v-if="assets">
      <section class="cards centered" v-if="assets">
        <asset v-for="asset in assets"
               :asset="asset"
               :key="asset.id">
        </asset>
      </section>
    </div>

  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import Artist from '../Artist';
  import Gallery from './Gallery';
  import Asset from '../Asset';
  import AddressIcon from '../ui-controls/AddressIcon';
  import EthAddress from '../ui-controls/EthAddress';

  export default {
    name: 'assets',
    components: {Asset},
    computed: {
      ...mapState([
        'assets'
      ])
    }
  };
</script>

<style scoped>
</style>
