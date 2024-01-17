<template>
  <div class="tags-page">
    {{ slug }}
  </div>
</template>
<script setup>
  const route = useRoute()
  const slug = computed(() => route.params.slug)
</script>
<style lang="scss" scoped>
</style>