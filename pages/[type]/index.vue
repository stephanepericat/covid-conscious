<script setup lang="ts">
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

const { data, error, pending } =
  await useLazySanityQuery<PUBLICATION_BY_TYPE_QUERYResult>(
    PUBLICATION_BY_TYPE_QUERY,
    {
      start,
      end,
      locale,
      type,
    },
  )

const total = computed(() => data?.value?.info?.total || 0)
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
    <section class="mt-4 md:mt-8">
      <div class="grid gap-4 md:gap-8 py-4 md:py-8" v-if="!pending">
        <!-- TODO: see if clientonly can be removed -->
        <ClientOnly>
          <TclMedia
            v-for="article in data?.results"
            v-key="article.id"
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
      <div className="pb-4 md:pb-8">
        <button :onClick="onPreviousPage">previous page</button> |
        <button :onClick="(e) => onNextPage(e, total)">next page</button>
        |
        <button :onClick="resetPagination">reset</button>
      </div>
      <!-- <pre>{{ data }}</pre> -->
    </section>
  </div>
</template>
