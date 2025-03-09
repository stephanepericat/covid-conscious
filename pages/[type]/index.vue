<script setup lang="ts">
import { cn } from '@/lib/utils'
import PUBLICATION_BY_TYPE_QUERY from '@/sanity/queries/publicationsByType.sanity'
import { usePagination } from '@/composables/usePagination'
import { isExternalLink } from '@/assets/utils/article-types'

import type { PUBLICATION_BY_TYPE_QUERYResult } from '@/sanity/types'
import type { Tag } from '@/lib/types'

const {
  currentPage,
  limit,
  offset,
  onNextPage,
  onPreviousPage,
  resetPagination,
  route,
} = usePagination()

const { locale } = useI18n()

const type = computed(() => route.params.type || null)
const start = computed(() => offset.value)
const end = computed(() => offset.value + (limit.value - 1))

const { data, error, status } =
  await useLazySanityQuery<PUBLICATION_BY_TYPE_QUERYResult>(
    PUBLICATION_BY_TYPE_QUERY,
    {
      start,
      end,
      locale,
      type,
    },
  )

const loading = computed(
  () => status?.value === 'pending' || status?.value === 'idle',
)

const total = computed(() => data?.value?.info?.total || 0)
const pages = computed(() => Math.ceil(total.value / limit.value))
const previousPageDisabled = computed(() => currentPage.value === 1)
const nextPageDisabled = computed(() => currentPage.value === pages.value)
</script>

<template>
  <div class="container pt-4 md:pt-8">
    <div class="flex justify-between items-center">
      <div>
        <h1
          class="scroll-m-20 text-4xl font-extrabold lg:text-5xl font-title uppercase"
        >
          {{ $t(`layout.${type}`) }}
        </h1>
        <h4
          class="scroll-m-20 text-base lg:text-xl font-semibold tracking-tight"
        >
          {{ $t(`description.${type}`) }}
        </h4>
      </div>
      <TclFiltersSheet />
    </div>
    <section class="my-4 md:my-8">
      <TclLoader v-if="loading" />
      <div class="grid gap-4 md:gap-8 py-4 md:py-8" v-else>
        <!-- TODO: see if clientonly can be removed -->
        <ClientOnly>
          <TclMedia
            v-for="article in data?.results"
            :key="article.id"
            :date="article.date"
            :description="article.description"
            :free="article.attributes.free"
            :link="<string>(article.link || article.url || '')"
            :limited="article.attributes.limited"
            :metadata="article.metadata"
            :premium="article.attributes.premium"
            :tags="<Tag[]>article.tags"
            :target="isExternalLink(article.type) ? '_blank' : '_self'"
            :title="<string>article.title"
            :visual="article.visual"
          />
        </ClientOnly>
      </div>
      <div>
        <button
          :disabled="previousPageDisabled"
          :onClick="onPreviousPage"
          :class="cn(previousPageDisabled ? 'text-muted-foreground' : '')"
        >
          previous page
        </button>
        |
        <button
          :disabled="nextPageDisabled"
          :onClick="(e) => onNextPage(e, total)"
          :class="cn(nextPageDisabled ? 'text-muted-foreground' : '')"
        >
          next page
        </button>
        |
        <button :onClick="resetPagination">reset</button>
        | <span>current page: {{ currentPage }} / {{ pages }}</span>
      </div>
      <!-- <pre>{{ data }}</pre> -->
    </section>
  </div>
</template>
