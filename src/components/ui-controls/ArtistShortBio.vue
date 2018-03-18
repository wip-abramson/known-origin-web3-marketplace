<template>
  <div v-if="artist">
      <img :src="artist.img" style="max-width: 150px; float:right"/>
      <h1>{{ artist.name }}</h1>

  </div>
</template>

<script>
  export default {
    name: 'artistShortBio',
    props: ['artist'],
  };
</script>

<style scoped>
  .twitter {
    background-color: deepskyblue;
    padding: 10px;
  }
</style>
