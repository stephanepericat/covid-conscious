<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <h1>{{ route.params.slug }}</h1>
</template>
