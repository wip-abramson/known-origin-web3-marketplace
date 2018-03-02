<template>
  <div class="artist-tile">
    <h3>{{ artist.name }}</h3>
    <img :src="artist.img"/>
    <p>{{ artist.bio }}</p>
  </div>
</template>

<script>
  export default {
    name: 'artist',
    props: ['artist'],
  }
</script>

<style scoped>
  .artist-tile {
    text-align: center;
    padding: 10px;
    margin: 5px;
    border: 1px solid gray;
  }
</style>
