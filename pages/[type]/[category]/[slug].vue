<script lang="ts" setup>
import { motion } from 'motion-v'
import { SERIALIZERS } from '@/assets/constants/serializers'
import PUBLICATION_QUERY from '@/sanity/queries/publication.sanity'
import METADATA_QUERY from '@/sanity/queries/metadata.sanity'
import { isVideo } from '@/assets/utils/article-types'
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

const hasReadMoreButton = computed(() => !isVideo(type as string))
const hasSplash = computed(() => !isVideo(type as string))
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
    <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" v-else>
      <TclArticleHeader
        v-if="article"
        class="mb-4 md:mb-10"
        :date="<string | null>article.date"
        :source="<string | null>article.source"
        :title="<string>article.title"
      />
      <section class="font-pt text-lg">
        <SanityImage
          v-if="hasSplash && article?.thumbnail"
          :alt="article.title"
          :asset-id="article.thumbnail"
          :w="768"
          class="w-full h-auto rounded-xl mb-8"
        />
        <div
          class="video-container rounded-xl overflow-hidden bg-muted mb-8 aspect-video"
          v-html="article.embedCode"
          v-if="isVideo(<string>type) && article?.embedCode"
        />
        <div class="article-body">
          <SanityContent
            v-if="article?.body"
            :blocks="<any>article?.body"
            :serializers="SERIALIZERS"
          />
        </div>
      </section>
      <section v-if="article?.link" class="py-2">
        <TclMoreButton
          v-if="hasReadMoreButton"
          :label="$t('article.readMore')"
          :link="<string>article.link"
          target="_blank"
        />
        <TclMoreButton
          v-if="isVideo(<string>type) && !article?.embedCode"
          :label="$t('article.watchVideo')"
          :link="<string>article.link"
          target="_blank"
        />
      </section>
      <section
        v-if="article?.tags?.length"
        class="flex flex-wrap gap-2 pt-2 md:pt-4"
      >
        <TclTagList
          :free="article?.free as boolean"
          :limited="article?.limited as boolean"
          :premium="article?.premium as boolean"
          :tags="<Tag[]>article.tags"
        />
      </section>
      <template v-if="article?.related?.length">
        <Separator class="my-8" />
        <section class="grid gap-4 md:gap-8">
          <h2 class="font-pt text-2xl font-semibold uppercase tracking-widest">
            {{ t('article.related') }}
          </h2>
          <TclMedia
            v-for="related in article?.related"
            :key="related.id"
            :description="
              related.description ? `${related.description}...` : ''
            "
            :link="<string>related.url"
            :tags="<Tag[]>related.tags"
            :title="<string>related.title"
            :visual="<string>related.visual"
          />
        </section>
      </template>
    </motion.div>
  </div>
</template>
