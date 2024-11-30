<script setup>
import Card from './Card.vue'

defineProps({
  articles: { type: Array, default: [] },
  title: { type: String, required: true },
})

const localePath = useLocalePath()
</script>

<template>
  <div>
    <h3 class="mb-8" v-text="title" />
    <div class="grid lg:grid-cols-3 gap-4 lg:gap-8">
      <Card
        v-for="article in articles"
        :key="article.id"
        :date="article.date"
        :tags="article.tags"
        :title="article.title"
        :url="localePath(article.url)"
        :visual="article.visual"
      />
    </div>
  </div>
</template>
