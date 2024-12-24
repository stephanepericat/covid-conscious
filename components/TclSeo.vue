<script setup lang="ts">
defineProps({
  description: { type: String, required: true },
  image: { type: String, default: null },
  imageType: { type: String, default: null },
  title: { type: String, required: true },
})

const { locale } = useI18n()
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
    <Meta name="description" :content="description" />
    <Meta name="og:title" :content="title" />
    <Meta name="og:description" :content="description" />
    <Meta v-if="image" name="og:image" :content="image" />
    <Meta v-if="image" name="og:image:secure_url" :content="image" />
    <Meta v-if="imageType" name="og:image:type" :content="imageType" />
    <Meta v-if="image" name="og:image:alt" :content="title" />
    <Meta name="og:locale" :content="locale" />
    <Meta name="og:site_name" :content="$t('layout.tcl')" />
    <Meta name="twitter:title" :content="title" />
    <Meta name="twitter:description" :content="description" />
    <Meta v-if="image" name="twitter:image" :content="image" />
    <Meta name="twitter:site" content="@thatcovidlife" />
    <Meta name="twitter:card" content="summary_large_image" />
  </Head>
</template>