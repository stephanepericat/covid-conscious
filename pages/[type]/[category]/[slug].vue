<script lang="ts" setup>
const route = useRoute()
const articleId = ref(route.params.slug)
</script>

<template>
  <div class="container max-w-3xl py-4 md:py-8">
    <h1>{{ articleId }}</h1>
  </div>
</template>
