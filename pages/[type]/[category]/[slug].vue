<script lang="ts" setup>
import PUBLICATION_QUERY from '@/sanity/queries/publication.sanity'
import type { PUBLICATION_QUERYResult } from '@/sanity/types'

const route = useRoute()
const { locale } = useI18n()

const { category, slug, type } = route.params

const { data, status } = await useLazySanityQuery<PUBLICATION_QUERYResult>(
  PUBLICATION_QUERY,
  { category, locale, slug, type },
)

const loading = computed(
  () => status?.value === 'pending' || status?.value === 'idle',
)
</script>

<template>
  <div class="container max-w-3xl py-4 md:py-8">
    <TclLoader v-if="loading" />
    <template v-else>
      <h1>{{ data?.title }}</h1>
    </template>
  </div>
</template>
