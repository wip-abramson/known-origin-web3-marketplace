<template>
  <div>
    <h3>
      <span v-if="!purchase">{{ edition.otherMeta.artworkName }}</span>
      by
      {{ edition.otherMeta.artist }}
    </h3>
    <p class="edition-code">{{ edition.edition }}</p>
  </div>
</template>

<script>
  export default {
    name: 'editionNameByArtist',
    props: ['edition', 'purchase'],
  };
</script>

<style scoped>
  .edition-code {
    font-size: 0.85em;
    padding: 0px;
  }
</style>
