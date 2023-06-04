<template>
  <div>{{ type }} index</div>
</template>
<script setup>
  const { params } = useRoute();
  const { type } = params;
</script>