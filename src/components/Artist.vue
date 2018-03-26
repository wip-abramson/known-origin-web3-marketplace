<template>
  <article class="card" v-if="artist">
    <div class="card-content">
      <figure class="thumbnail">
        <img :src="artist.img"/>
      </figure>

      <h3>{{ artist.name }}</h3>

      <p>{{ artist.strapline }}</p>

      <p v-if="artist.twitter">
       {{artist.twitter}}
      </p>

      <router-link :to="{ name: 'artist', params: { artistCode: artist.artistCode} }">View artist</router-link>
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
