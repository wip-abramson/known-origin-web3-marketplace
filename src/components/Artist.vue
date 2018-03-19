<template>
  <article class="card" v-if="artist">
    <div class="card-content">

      <router-link :to="{ name: 'artist', params: { id: artist.id} }">
        <figure class="thumbnail">
          <!--<img :src="artist.img"/>-->
          <img src="../assets/artists/ArtistBarrieD_preview.jpeg"/>
        </figure>

        <h2>{{ artist.name }}</h2>

        <p>{{ artist.bio }}</p>

        <p v-if="artist.twitter">
          <a :href="'http://twitter.com/' + artist.twitter" target="_blank" class="twitter">{{artist.twitter}}</a>
        </p>

      </router-link>
    </div>
    <!-- .card-content -->
  </article>
</template>

<script>
  export default {
    name: 'artist',
    props: ['artist'],
  };
</script>

<style scoped>
  .twitter {
    background-color: deepskyblue;
    padding: 10px;
  }
</style>
