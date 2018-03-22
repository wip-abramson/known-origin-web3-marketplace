<template>
  <article class="card" v-if="artist">
    <div class="card-content">
      <router-link :to="{ name: 'artist', params: { id: artist.id} }">
        <figure class="thumbnail">
          <img :src="artist.img"/>
        </figure>

        <h2>{{ artist.name }}</h2>

        <p>{{ artist.bio }}</p>

        <p v-if="artist.twitter">
         {{artist.twitter}}
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
</style>
