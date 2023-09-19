<template>
  <SanityImage
    class="cc-inline-image"
    :asset-id="asset._ref"
  />
</template>
<script setup>
  const props = defineProps({
    asset: Object
  })
</script>
<style>
.cc-inline-image {
  margin: 20px auto;
  max-width: 100%;
}
</style>