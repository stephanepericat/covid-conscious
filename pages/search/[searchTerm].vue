<template>
  <div class="search-page" :class="{ pending }">
    <ILoader v-if="pending || loading" class="search-page__loader" />
    <template v-else>
      <h1 class="search-page__title">{{ $t("search.pageTitle", { searchTerm, totalItems }) }}</h1>
      <PublicationFilters
        :content-types="filterContentTypes"
        :languages="filterLanguages"
        :type="SEARCH"
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
  import searchQuery from '~/sanity/queries/searchContent.sanity'
  import { useLanguages } from '~/assets/composables/useLanguages'
  import { usePagination } from '~/assets/composables/usePagination'
  import { usePosts } from '~/assets/composables/usePosts'
  import { mapForumSearchResult } from '~/assets/utils/map-forum-results'
  import { SEARCH } from '~/assets/constants/types'

  const { getLanguages } = useLanguages()
  const { locale, t } = useI18n()
  const route = useRoute()
  const searchTerm = computed(() => route.params.searchTerm)
  const { searchPosts, loading } = usePosts()

  useHead({
    meta: [
      { name: 'description', content: t('search.description') },
    ],
    title: t('search.title', { searchTerm: searchTerm.value })
  })

  const { currentPage, itemsPerPage, startItem, endItem } = usePagination()

  const { data, pending } = useSanityQuery(searchQuery, { locale, searchTerm })
  const forumSearch = await searchPosts(searchTerm.value)
  const searchResults = computed(() => {
    const merged = [...forumSearch.map(mapForumSearchResult), ...data.value.results];
    return _.orderBy(merged, 'published', 'desc')
  })

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

  umTrackView()
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.search-page {
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