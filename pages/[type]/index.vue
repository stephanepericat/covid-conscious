<script setup lang="ts">
import consola from 'consola'
import { usePagination } from '@/composables/usePagination'
import { useGroqd } from '@/composables/useGroqd'
import { isExternalLink } from '@/assets/utils/article-types'
import { BASE_LANGUAGE } from '@/assets/constants/base-language'

import type { Publication, Tag } from '@/lib/types'

const { currentPage, limit, offset, onPageChange, route, updateQueryParams } =
  usePagination()

const { locale } = useI18n()

const type = computed(() => route.params.type || null)
const start = computed(() => offset.value)
const end = computed(() => offset.value + limit.value)
const filters = computed(() => route.query || {})
const results = ref<Publication[]>([])

const loading = ref(false)
const total = ref(0)

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
  let query = q.star
    .filterByType(type as any)
    .filterRaw(`!(_id in path('drafts.**'))`)
    .filterRaw(`language == "${locale}"`)

  Object.keys(filters).forEach((key: string) => {
    if (key === 'tag') {
      query = query.filterRaw(`"${filters[key]}" in tags[]->uri.current`)
    }
  })

  const countQuery = q.count(query)

  // @ts-ignore
  query = query.order('publicationDate desc, _createdAt desc').slice(start, end)

  query = query.project((sub) => ({
    date: sub.raw<Date | string>(
      'coalesce(eventDate, publicationDate, _createdAt)',
    ),
    description: sub.raw<string | null>(
      `array::join(string::split(pt::text(coalesce(description[_key == ${locale}][0].value, description[_key == ^.language][0].value, description[_key == '${BASE_LANGUAGE}'][0].value, [])), "")[0..384], "") + "..."`,
    ),
    end: sub.raw<Date | string | null>('endDate'),
    free: sub.raw<boolean | null>('coalesce(isEventFree, false)'),
    id: sub.raw<string>('_id'),
    language: sub.raw<string>('language'),
    limited: sub.raw<boolean>('coalesce(limitedAccess, false)'),
    link: sub.raw<string>(
      `"/" + _type + "/" + tags[0]->uri.current + "/" + uri.current`,
    ),
    metadata: sub.raw<Record<string, any> | null>(
      'visual.asset->metadata.dimensions { aspectRatio, height, width }',
    ),
    onlineOnly: sub.raw<boolean>('coalesce(onlineOnly, false)'),
    premium: sub.raw<boolean>('coalesce(premiumAccess, false)'),
    source: sub.raw<string | null>('coalesce(source, null)'),
    tags: sub.raw<Tag[]>(
      `tags[]-> { 'label': coalesce(name[${locale}], name['${BASE_LANGUAGE}'], ''), 'slug': uri.current }`,
    ),
    title: sub.raw<string | null>(
      `coalesce(title[_key == '${locale}'][0].value, title[_key == '${BASE_LANGUAGE}'][0].value, title[_key == ^.language][0].value, title['${locale}'], title['${BASE_LANGUAGE}'], title, null)`,
    ),
    type: sub.raw<string>('_type'),
    url: sub.raw<string | null>('url'),
    visual: sub.raw<string | null>('visual.asset._ref'),
  }))

  try {
    loading.value = true

    const data = await runQuery(query)
    const count = await runQuery(countQuery)

    results.value = data as unknown as Publication[]
    total.value = count
  } catch (error) {
    consola.error(error)
  } finally {
    loading.value = false
  }
}

const onUpdateFilters = (filters: Record<string, string>) =>
  updateQueryParams({ ...filters, offset: '0', limit: '5' })

watch(
  () => filters.value,
  () => {
    buildDynamicQuery({
      end:
        parseInt(filters.value.offset as string) +
        parseInt(filters.value.limit as string),
      filters: filters.value as Record<string, string>,
      locale: locale.value,
      start: parseInt(filters.value.offset as string),
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
            v-for="article in results"
            :key="article.id"
            :date="article.date"
            :description="article.description"
            :free="article.free"
            :link="<string>(article.link || article.url || '')"
            :limited="article.limited"
            :metadata="article.metadata"
            :premium="article.premium"
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
