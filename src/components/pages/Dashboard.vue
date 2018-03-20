<template>
  <div id="dashboard">

    <div id="splash">
      <h2 class="strap">Buy original artwork and rare digital art</h2>
      <router-link :to="{ name: 'gallery' }" tag="button" class="btn">View gallery</router-link>
    </div>

    <div id="intro">
      <h2>What is KnownOrigin.io</h2>
      <div class="centered">
        <section>
          We have built a platform that allows people to own original art linked to a digital asset.
        </section>
        <section>
          KnownOrigin.io brings together Blockchain technology and digital artworks though the power of
          Web3 and ERC-721 backed digital arts assets.
        </section>
        <section>
          <div id="quote">
            <p>
              Can we use the power of Ethereum blockchain and the integrity of digital assets in the art world to
              improve the proof of ownership, provenance, authenticity and reducing forgery of artwork?
            </p>
          </div>
        </section>
      </div>
    </div>

    <div id="featured-artists">
      <h2>Featured artists</h2>
      <div class="centered">
        <section class="cards">
            <artist v-for="artist in featuredArtists" :artist="artist" :key="artist.name"></artist>

          <router-link :to="{ name: 'artists' }" tag="button" class="btn btn-center">View artists</router-link>
        </section>
      </div>
    </div>

    <div id="how-ko-works">
      <h2>How KnownOrigin.io works</h2>
      <div class="centered">
        <section>
          <p>
            Selling va the KnownOrigin marketplace is a new wat for artist, illustrators and creative practitioners to monetize their craft.
          </p>
          <p>
            Is artists have the freedom to be more original, more people can own original artwork.
          </p>
        </section>
        <section>
          <h3>Step 1.</h3>
          <h4>The artist creates a digital file.</h4>
          <p>
            The artist can create a digital file and submit it to the gallery. The gallery requires a low resolution & quality version of the artwork.
          </p>
          <p>
            The artist defines the number of copies that should exist on the blockchain, scarcity is defined.
          </p>
          <p>
            The artist defines the price in Ether that each asset is to be sold at.
          </p>
        </section>
        <section>
          <h3>Step 2.</h3>
          <h4>Asset uploaded.</h4>
          <p>
            Upon upload, a corresponding ERC-721 compliant tradeable token is created, also know a KODA token, on the Ethereum public Blockchain.
          </p>
          <p>
            KnownOrigin.io use the latest ERC-721 compliant smart contract to manage asset identity and purchasing.
          </p>
        </section>
        <section>
          <h3>Step 3.</h3>
          <h4>People can by the art work using Ethereum.</h4>
          <p>
            Art buyers are assigned the corresponding KODA token at the point of purchase.
          </p>
          <p>
            The KODA smart contract provides proof of ownership as well as seamless and transparent transfers of assets.
          </p>
        </section>
        <section>
          <h3>Step 4.</h3>
          <h4>Collectors can view purchase Artwork.</h4>
          <p>
            KnownOrigin.io provides an Account page which will show for all owned KODA assets.
          </p>
          <p>
            Each digital asset is traceable via Ethereum at all times, KODA does not own the rights to the digital asset once purchased.
          </p>
        </section>
      </div>
    </div>

    <div id="partners">
      <h2>Our partners</h2>
      <img src="../../../static/Partner_Footer2.png" style="max-width: 100%"/>
    </div>

  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex';
  import Artist from '../Artist';
  import Gallery from './Gallery';

  export default {
    name: 'dashboard',
    components: {Artist, Gallery},
    computed: {
      ...mapGetters([
        'featuredArtists'
      ])
    }
  };
</script>

<style scoped>

</style>
