<script setup>
import Card from './Card.vue'

defineProps({
  products: { type: Array, default: [] },
  title: { type: String, required: true },
})

const localePath = useLocalePath()
</script>

<template>
  <div>
    <h3 class="mb-8" v-text="title" />
    <div class="grid lg:grid-cols-3 gap-4 lg:gap-8">
      <Card
        v-for="product in products"
        :key="product.id"
        :description="product.description"
        :tags="product.tags"
        :title="product.title"
        :url="localePath(product.url)"
        :visual="product.visual"
      />
    </div>
  </div>
</template>
