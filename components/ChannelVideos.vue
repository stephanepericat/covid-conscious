<script setup>
import Card from './Card.vue'

defineProps({
  title: { type: String, required: true },
  videos: { type: Array, default: [] },
})
</script>

<template>
  <div>
    <h3 class="mb-8" v-text="title" />
    <div class="grid lg:grid-cols-3 gap-4 lg:gap-8">
      <Card
        v-for="video in videos"
        :key="video.id"
        :date="video.date"
        is-video
        :description="video.description"
        target="blank"
        :thumbnail="video.thumbnail"
        :title="video.title"
        :url="video.url"
      />
    </div>
  </div>
</template>
