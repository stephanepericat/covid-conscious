<template>
  <div class="author-page">{{ slug }}</div>
</template>
<script setup>
const { params } = useRoute();
const { slug } = params;
</script>