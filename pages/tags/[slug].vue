<template>
  <div class="tags-page" :class="{ pending }">
    <ILoader v-if="pending" class="tags-page__loader" />
    <template v-else>
      <h1 class="tags-page__title">{{ $t("tags.pageTitle", { tagName, totalItems }) }}</h1>
      <PublicationFilters
        :content-types="filterContentTypes"
        :languages="filterLanguages"
        :type="TAG"
        v-model:selected-content-type="selectedContentType"
        v-model:selected-language="selectedLanguage"
      />
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
  import _ from 'lodash'
  import PublicationFilters from '~/components/PublicationFilters.vue'
  import PublicationList from '~/components/PublicationList.vue'
  import publicationsByTagQuery from '~/sanity/queries/publicationsByTag.sanity'
  import { useLanguages } from '~/assets/composables/useLanguages'
  import { usePagination } from '~/assets/composables/usePagination'
  import { TAG } from '~/assets/constants/types'

  const { getLanguages } = useLanguages()
  const { currentPage, itemsPerPage, startItem, endItem } = usePagination()
  const { locale, t } = useI18n()
  const route = useRoute()
  const slug = computed(() => route.params.slug)

  const { data, pending } = useSanityQuery(publicationsByTagQuery, { locale, slug })
  const searchResults = computed(() => data?.value?.results || [])
  const tagName = computed(() => data?.value?.metadata?.label || '')

  const filterContentTypes = computed(() => {
    const contentTypes = searchResults.value.map((r) => r.type)

    return _.sortBy(
      _.uniqBy(
        contentTypes.map((type) => ({ label: t(`layout.${type}`), id: type })),
        'id'
      ),
    'label')
  });
  const selectedContentType = ref(null)

  const filterLanguages = computed(() => {
    const articles = selectedContentType.value
      ? searchResults.value.filter((r) => r.type === selectedContentType.value)
      : searchResults.value
    const codes = articles.filter((r) => !!r.language).map((r) => r.language)
    const matches = getLanguages(codes)

    return _.sortBy(
      _.uniqBy(
        matches.map(({ code, name }) => ({ label: name, id: code })),
        'id'
      ),
    'label')
  });

  const selectedLanguage = ref(null)

  const matches = computed(() => {
    let items = searchResults.value ? [...searchResults.value] : []

    if(
      !selectedLanguage.value &&
      !selectedContentType.value
    ) {
      return items
    }

    if(selectedContentType.value) {
      items = items.filter((result) => result.type === selectedContentType.value)
    }

    if(selectedLanguage.value) {
      items = items.filter((result) => result.language === selectedLanguage.value)
    }

    return items
  })

  const totalItems = computed(() => matches.value.length || 0)
  const visibleItems = computed(() => matches.value.slice(startItem.value, endItem.value) || [])

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