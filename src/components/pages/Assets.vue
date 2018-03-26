<template>
  <div id="account">
    <h1><router-link :to="{ name: 'dashboard' }" class="back-arrow">&lt;</router-link> Assets</h1>

    <h2 v-if="assets">{{ assets.length }} assets</h2>

    <div class="centered">
      <section class="cards" v-if="assets">
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
