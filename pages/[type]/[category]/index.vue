<template>
  <div>{{ category }} index</div>
</template>
<script setup>
  const { params } = useRoute();
  const { category } = params;
</script>