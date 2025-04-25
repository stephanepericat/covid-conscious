<script lang="ts" setup>
import { SERIALIZERS } from '@/assets/constants/serializers'
import PUBLICATION_QUERY from '@/sanity/queries/publication.sanity'
import METADATA_QUERY from '@/sanity/queries/metadata.sanity'
import type {
  METADATA_QUERYResult,
  PUBLICATION_QUERYResult,
} from '@/sanity/types'
import type { Tag } from '@/lib/types'

const route = useRoute()
const { locale, t } = useI18n()

const { category, slug, type } = route.params

const { data: metadata } = useLazySanityQuery<METADATA_QUERYResult>(
  METADATA_QUERY,
  {
    category,
    locale,
    slug,
    type,
  },
)

const pageTitle = computed(
  () => metadata?.value?.title || metadata?.value?.name || '',
)
const pageDescription = computed(
  () => metadata?.value?.description || t('home.description'),
)
const ogImage = computed(() =>
  metadata?.value?.image
    ? `${metadata.value.image}?crop=entropy&fit=crop&h=450&w=800`
    : '/tcl-fallback-169.jpg',
)
const ogImageType = computed(() => {
  const extension =
    ogImage?.value?.split('.')?.pop()?.split('?').shift() || 'jpeg'
  return `image/${extension}`
})

const { data: article, status } =
  await useLazySanityQuery<PUBLICATION_QUERYResult>(PUBLICATION_QUERY, {
    category,
    locale,
    slug,
    type,
  })

const loading = computed(
  () => status?.value === 'pending' || status?.value === 'idle',
)
</script>

<template>
  <div class="container max-w-3xl py-4 md:py-8">
    <TclSeo
      :description="pageDescription"
      :image="ogImage"
      :image-type="ogImageType"
      :title="<string>pageTitle"
    />
    <TclLoader v-if="loading" />
    <template v-else>
      <TclArticleHeader
        v-if="article"
        class="mb-4 md:mb-10"
        :date="<string | null>article.date"
        :source="<string | null>article.source"
        :title="<string>article.title"
      />
      <section class="font-pt text-lg">
        <SanityImage
          v-if="article?.thumbnail"
          :alt="article.title"
          :asset-id="article.thumbnail"
          :w="768"
          class="w-full h-auto rounded-xl mb-8"
        />
        <div v-motion-fade-visible class="article-body">
          <SanityContent
            v-if="article?.body"
            :blocks="<any>article?.body"
            :serializers="SERIALIZERS"
          />
        </div>
      </section>
      <section
        v-if="article?.tags?.length"
        class="flex flex-wrap gap-2 pt-2 md:pt-4"
        v-motion-fade-visible
      >
        <TclTagList :tags="<Tag[]>article.tags" />
      </section>
      <Separator v-if="article?.related?.length" class="my-8" />
      <section
        v-if="article?.related?.length"
        class="grid gap-4 md:gap-8"
        v-motion-fade-visible
      >
        <h2 class="font-pt text-2xl font-semibold uppercase tracking-widest">
          {{ t('article.related') }}
        </h2>
        <TclMedia
          v-for="related in article?.related"
          :key="related.id"
          :description="related.description ? `${related.description}...` : ''"
          :link="<string>related.url"
          :tags="<Tag[]>related.tags"
          :title="<string>related.title"
          :visual="<string>related.visual"
        />
      </section>
    </template>
  </div>
</template>
