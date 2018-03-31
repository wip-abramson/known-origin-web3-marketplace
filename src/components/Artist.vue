<template>
  <article class="card" v-if="artist">

    <div class="card-content">
      <div class="artist-info">
        <router-link :to="{ name: 'artist', params: { id: artist.id} }">
          <figure class="thumbnail">
            <img :src="artist.img"/>
          </figure>
        </router-link>
        <h3 class="uppercase">{{ artist.name }}</h3>

        <p>{{ artist.strapline }}</p>
      </div>
      <div class="twitterLink">

        <p v-if="artist.twitter">
          <a :href="'http://twitter.com/' + artist.twitter" target="_blank">{{ artist.twitter }}</a>
        </p>
      </div>

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
