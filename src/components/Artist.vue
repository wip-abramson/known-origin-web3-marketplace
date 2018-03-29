<template>
  <article class="card" v-if="artist">
    <div class="card-content">
      <router-link :to="{ name: 'artist', params: { artistCode: artist.artistCode} }">
        <figure class="thumbnail">
          <img :src="artist.img"/>
        </figure>
      </router-link>

        <h3 class="uppercase">{{ artist.name }}</h3>

        <p>{{ artist.strapline }}</p>
        <p v-if="artist.twitter">
          <a :href="'http://twitter.com/' + artist.twitter" target="_blank">{{ artist.twitter }}</a>
        </p>
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
</style>
