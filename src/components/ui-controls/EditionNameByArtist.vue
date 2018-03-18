<template>
  <h3>
    {{ edition.editionName }}
    by
    {{ edition.artist }}
  </h3>
</template>

<script>
  export default {
    name: 'editionNameByArtist',
    props: ['edition'],
  };
</script>

<style scoped>
</style>
