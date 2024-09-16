<script setup>
  import Tweet from 'vue-tweet'
  import Card from './Card.vue'
  import { covidnetTypes } from '~/assets/constants/covidnet-types'

  defineProps({
    contentType: {
      type: String,
      required: true,
      validation:(value) => [covidnetTypes.BLOG, covidnetTypes.TWITTER].includes(value)
    },
    posts: { type: Array, default: [] },
    title: { type: String, required: true },
  })
</script>

<template>
  <div>
    <h3 class="mb-8" v-text="title" />
    <div class="grid lg:grid-cols-3 gap-4 lg:gap-8">
      <Card
        v-if="contentType === covidnetTypes.BLOG"
        v-for="post in posts"
        :key="post.id"
        :date="post.date"
        :description="post.description"
        hide-thumbnail
        target="blank"
        :title="post.title"
        :url="post.url"
      />
      <Tweet
        v-if="contentType === covidnetTypes.TWITTER"
        v-for="post in posts"
        :key="post"
        :tweet-url="post"
      />
    </div>
  </div>
</template>
