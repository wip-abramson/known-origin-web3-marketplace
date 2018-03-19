<template>
  <div>
    <h3>
      {{ edition.editionName }}
      by
      {{ edition.artist }}
    </h3>
    <p class="edition-code">{{ edition.edition }}</p>
  </div>
</template>

<script>
  export default {
    name: 'editionNameByArtist',
    props: ['edition'],
  };
</script>

<style scoped>
  .edition-code {
    font-size: 0.85em;
    padding: 0px;
  }
</style>
