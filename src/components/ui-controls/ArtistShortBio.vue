<template>
  <div v-if="artist">
      <h1><router-link :to="{ name: 'artists' }" class="back-arrow">&lt;</router-link>{{ artist.name }}</h1>

      <!--<img :src="artist.img"/>-->
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
