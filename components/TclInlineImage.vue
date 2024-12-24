<script setup lang="ts">
defineProps({
  asset: Object,
})
</script>

<template>
  <SanityImage class="max-w-full mx-auto my-5" :asset-id="asset?._ref" />
</template>
