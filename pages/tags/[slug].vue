<template>
  <div class="tags-page" :class="{ pending }">
    <ILoader v-if="pending || loading" class="tags-page__loader" />
    <template v-else>
      <h1 class="tags-page__title">{{ $t("tags.pageTitle", { tagName, totalItems }) }}</h1>
      <PublicationList
        :items="visibleItems"
        :items-per-page="itemsPerPage"
        :total="totalItems"
        with-pagination
        v-model:current-page="currentPage"
      />
    </template>
  </div>
</template>
<script setup>
  import publicationsByTagQuery from '~/sanity/publicationsByTag.sanity'
  import { usePagination } from '~/assets/composables/usePagination'

  const { currentPage, itemsPerPage, startItem, endItem } = usePagination()
  const { locale, t } = useI18n()
  const route = useRoute()
  const slug = computed(() => route.params.slug)

  const { data, pending } = useSanityQuery(publicationsByTagQuery, { locale, slug })
  const searchResults = computed(() => data?.value?.results || [])
  const tagName = computed(() => data?.value?.metadata?.label || '')
  const totalItems = computed(() => data?.value?.total || 0)
  const visibleItems = computed(() => searchResults?.value?.slice(startItem.value, endItem.value) || [])

  useHead({
    meta: [
      { name: 'description', content: t('tags.description') },
    ],
    title: t('tags.title', { tagName: tagName.value })
  })

  umTrackView()
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.tags-page {
  &.pending {
    @include pending();
  }

  &__title {
    @include title();
    margin-bottom: 30px;
  }

  &__loader {
    @include loader();
  }
}
</style>