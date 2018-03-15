<template>
  <article class="card" v-if="artist">
    <router-link :to="{ name: 'artist' }">
      <figure class="thumbnail">
        <img :src="artist.img"/>
      </figure>
      <div class="card-content">
        <h2>{{ artist.name }}</h2>
        <p>{{ artist.bio }}</p>
        <p v-if="artist.twitter">
          <a :href="'http://twitter.com/' + artist.twitter" target="_blank" class="twitter">{{artist.twitter}}</a>
        </p>
      </div>
    </router-link>
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
