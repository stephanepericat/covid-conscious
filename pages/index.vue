<script setup lang="ts">
import type { Tag } from '@/lib/types'
import LATEST_PUBLICATIONS_QUERY from '@/sanity/queries/latestPublications.sanity'
import type { LATEST_PUBLICATIONS_QUERYResult } from '@/sanity/types'

const host = computed(() => window?.location?.origin || '')
const { locale } = useI18n()

const { data, status } =
  await useLazySanityQuery<LATEST_PUBLICATIONS_QUERYResult>(
    LATEST_PUBLICATIONS_QUERY,
    { locale },
  )

const loading = computed(
  () => status?.value === 'pending' || status?.value === 'idle',
)
// const error = computed(() => status?.value === 'error')

const news = computed(() => data?.value?.news || [])
const showcase = computed(() => data?.value?.showcase || [])
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <TclSeo
      :description="$t('layout.description')"
      :image="`${host}/tcl-fallback-169.jpg`"
      image-type="image/jpeg"
      :title="$t('layout.home')"
    />

    <TclLoader v-if="loading" />

    <template v-else>
      <TclShowcase
        class="container mx-auto my-4 md:my-8 lg:my-12"
        :docs="showcase"
      />

      <div class="container">
        <h2 class="font-title font-bold text-[48px] uppercase">
          {{ $t('home.latestNews') }}
        </h2>

        <div
          class="grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12 py-6 md:py-12"
        >
          <TclPostCard
            v-for="article in news"
            :key="article.id"
            :date="article.date"
            :limited="article.limited"
            :link="article.link || ''"
            :metadata="article.metadata"
            :premium="article.premium"
            :tags="article.tags as Tag[]"
            target="_blank"
            :title="article.title || ''"
            :visual="article.visual"
          />
        </div>
      </div>
    </template>
  </div>
</template>
