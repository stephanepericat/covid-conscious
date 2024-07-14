<template>
  <div v-if="promo">
    <SanityImage
      v-if="promo.visual"
      :asset-id="promo.visual"
      :alt="promo.name"
      class="w-full"
      fit="crop"
      crop="entropy" 
      :h="height"
      :w="width"
    />
  </div>
</template>
<script setup>
  const props = defineProps({
    height: { type: Number, default: 900 },
    width: { type: Number, default: 1600 },
    zoneId: { type: String, required: true },
    zones: { type: Array, default: [] },
  })

  const promo = computed(() => props.zones.find((z) => z.zoneId === props.zoneId))
</script>