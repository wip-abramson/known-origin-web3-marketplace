<template>
  <article class="card" v-if="artist">
    <router-link :to="{ name: 'artist', params: { artistCode: artist.artistCode} }">
      <div class="card-content">
        <figure class="thumbnail">
          <img :src="artist.img"/>
        </figure>

        <h3 class="uppercase">{{ artist.name }}</h3>

        <p>{{ artist.strapline }}</p>
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
</style>
