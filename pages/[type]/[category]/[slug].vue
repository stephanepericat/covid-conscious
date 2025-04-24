<script lang="ts" setup>
import { SERIALIZERS } from '@/assets/constants/serializers'
import PUBLICATION_QUERY from '@/sanity/queries/publication.sanity'
import METADATA_QUERY from '@/sanity/queries/metadata.sanity'
import type {
  METADATA_QUERYResult,
  PUBLICATION_QUERYResult,
} from '@/sanity/types'

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
        <div class="font-thin leading-8">
          <SanityContent
            v-if="article?.body"
            :blocks="<any>article?.body"
            :serializers="SERIALIZERS"
          />
        </div>
      </section>
    </template>
  </div>
</template>
