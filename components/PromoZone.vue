<template>
  <div class="rounded-lg overflow-hidden shadow-md" v-if="promo">
    <NuxtLink
      :target="promo.external ? '_blank': '_self'"
      :to="promo.external ? promo.url : localePath(promo.url)"
    >
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
    </NuxtLink>
  </div>
</template>
<script setup>
  const props = defineProps({
    height: { type: Number, default: 900 },
    width: { type: Number, default: 1600 },
    zoneId: { type: String, required: true },
    zones: { type: Array, default: [] },
  })

  const localePath = useLocalePath()

  const promo = computed(() => props.zones.find((z) => z.zoneId === props.zoneId))
</script>