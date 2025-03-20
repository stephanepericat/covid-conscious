<script setup lang="ts">
import consola from 'consola'
// import PUBLICATION_BY_TYPE_QUERY from '@/sanity/queries/publicationsByType.sanity'
import { usePagination } from '@/composables/usePagination'
import { useGroqd } from '@/composables/useGroqd'
import { isExternalLink } from '@/assets/utils/article-types'

// import type { PUBLICATION_BY_TYPE_QUERYResult } from '@/sanity/types'
import type { Tag } from '@/lib/types'

const {
  currentPage,
  limit,
  offset,
  onPageChange,
  resetPagination,
  route,
  updateQueryParams,
} = usePagination()

const { locale } = useI18n()

const type = computed(() => route.params.type || null)
const start = computed(() => offset.value)
const end = computed(() => offset.value + limit.value)
const filters = computed(() => route.query || {})
const results = ref([])

// const { data, status } =
//   await useLazySanityQuery<PUBLICATION_BY_TYPE_QUERYResult>(
//     PUBLICATION_BY_TYPE_QUERY,
//     {
//       start,
//       end,
//       locale,
//       type,
//     },
//   )

// const loading = computed(
//   () => status?.value === 'pending' || status?.value === 'idle',
// )

// const total = computed(() => data?.value?.info?.total || 0)

const { q, runQuery } = useGroqd()

const buildDynamicQuery = async ({
  end,
  filters,
  locale,
  start,
  type,
}: {
  end: number
  filters: Record<string, string>
  locale: string
  start: number
  type: string
}) => {
  let query = q.star.filterByType(type as any)

  Object.keys(filters).forEach((key: string) => {
    if (key === 'tag') {
      query = query.filter(`"${filters[key]}" in tags[]->uri.current`)
    }
  })

  query = query.slice(start, end)

  try {
    const data = await runQuery(query)
    consola.info('data', data)
  } catch (error) {
    consola.error(error)
  } finally {
  }
}

const onUpdateFilters = (filters: Record<string, string>) =>
  updateQueryParams(filters)

watch(
  () => filters.value,
  () => {
    buildDynamicQuery({
      end: end.value,
      filters: filters.value as Record<string, string>,
      locale: locale.value,
      start: start.value,
      type: type.value as string,
    })
  },
  { deep: true, immediate: true },
)
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
      <TclFiltersSheet
        :locale="locale"
        :type="<string>type"
        @update:filters="onUpdateFilters"
      />
    </div>
    <section class="my-4 md:my-8">
      <TclLoader v-if="loading" />
      <div class="grid gap-4 md:gap-8 py-4 md:py-8" v-else>
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
            :source="article.source ? (article.source as string) : undefined"
            :tags="<Tag[]>article.tags"
            :target="isExternalLink(article.type) ? '_blank' : '_self'"
            :title="<string>article.title"
            :visual="article.visual"
          />
        </ClientOnly>
      </div>
      <TclPagination
        v-if="total"
        :initial-page="currentPage"
        :limit="limit"
        :total="total"
        @page:change="onPageChange"
      />
      <!-- <pre>{{ data }}</pre> -->
    </section>
  </div>
</template>
