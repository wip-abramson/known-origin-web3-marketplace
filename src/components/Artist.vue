<template>
  <article class="card" v-if="artist">
    
    <div class="card-content">

      <router-link :to="{ name: 'artist', params: { id: artist.id} }">
        
        <div class="artist-info">
        <figure class="thumbnail">
          <img :src="artist.img"/>
        </figure>

        <h2>{{ artist.name }}</h2>

        <p>{{ artist.bio }}</p>
</div>
<div class="twitterLink">
        <p v-if="artist.twitter">
          <a :href="'http://twitter.com/' + artist.twitter" target="_blank" class="twitter">{{artist.twitter}}</a>
        </p>
</div>
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
