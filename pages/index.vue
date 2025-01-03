<script setup lang="ts">
import LATEST_PUBLICATIONS_QUERY from '@/sanity/queries/latestPublications.sanity'
import type { LATEST_PUBLICATIONS_QUERYResult } from '@/sanity/types'

const host = computed(() => window?.location?.origin || '')
const { locale } = useI18n()

const { data } = await useLazySanityQuery<LATEST_PUBLICATIONS_QUERYResult>(
  LATEST_PUBLICATIONS_QUERY,
  { locale },
)

const showcase = computed(() => data?.value?.showcase ?? [])
</script>

<template>
  <div className="flex flex-col justify-center items-center">
    <TclSeo
      :description="$t('layout.description')"
      :image="`${host}/tcl-fallback-169.jpg`"
      image-type="image/jpeg"
      :title="$t('layout.home')"
    />
    <TclShowcase
      class="container mx-auto my-4 md:my-8 lg:my-12"
      :docs="showcase"
    />
  </div>
</template>
