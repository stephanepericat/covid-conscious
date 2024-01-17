<template>
  <div class="search-page" :class="{ pending }">
    <ILoader v-if="pending || loading" class="search-page__loader" />
    <template v-else>
      <h1 class="search-page__title">{{ $t("search.pageTitle", { searchTerm, totalItems }) }}</h1>
      <PublicationList
        :items="visibleItems"
        :items-per-page="itemsPerPage"
        pagination
        :total="totalItems"
        v-model:current-page="currentPage"
      />
    </template>
  </div>
</template>
<script setup>
  import orderBy from 'lodash/orderBy'
  import searchQuery from '~/sanity/searchContent.sanity'
  import { usePagination } from '~/assets/composables/usePagination'
  import { usePosts } from '~/assets/composables/usePosts'
  import { mapForumSearchResult } from '~/assets/utils/map-forum-results'
  import PublicationList from '~/components/PublicationList.vue'

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
    return orderBy(merged, 'published', 'desc')
  })
  const totalItems = computed(() => searchResults?.value?.length || 0)
  const visibleItems = computed(() => searchResults?.value?.slice(startItem.value, endItem.value) || [])

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

  // &__link {
  //   @include titleLink();

  //   margin-bottom: 5px;
  // }

  // &__description {
  //   &.no-margin {
  //     margin: 0;
  //   }
  // }

  // &__thumbnail,
  // &__avatar {
  //   @include thumbnail();
  // }

  // &__pagination {
  //   @include pagination();
  // }
}
</style>