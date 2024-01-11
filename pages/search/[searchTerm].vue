<template>
  <div class="search-page" :class="{ pending }">
    <ILoader v-if="pending || loading" class="search-page__loader" />
    <template v-else>
      <h1 class="search-page__title">{{ $t("search.pageTitle", { searchTerm, totalItems }) }}</h1>
      <IListGroup size="sm" :border="false">
        <IListGroupItem v-for="article in visibleItems">
          <IMedia>
            <template #image>
              <SanityImage
                v-if="article.thumbnail"
                :asset-id="article.thumbnail"
                fit="crop"
                crop="entropy"
                :h="80"
                :w="80"
              />
              <img v-else-if="article.avatar" class="search-page__avatar" :src="article.avatar" />
              <div v-else class="search-page__thumbnail--fallback">
                <Icon class="search-page__thumbnail--fallback-icon" name="material-symbols:broken-image-outline" />
              </div>
            </template>
            <h3 class="search-page__link">
              <NuxtLink
                :to="isExternalLink(article.type) ? article.link : localePath(article.path)"
                :target="isExternalLink(article.type) ? '_blank' : '_self'"
              >
                <span v-if="isNews(article.type) || isLibrary(article.type)">{{ article.source }}: </span>{{ article.title }}
              </NuxtLink>
            </h3>
            <p
              v-if="(isResource(article.type) || isLibrary(article.type) || isVideo(article.type)) && article.summary"
              class="search-page__description"
              :class="{ 'no-margin': isLibrary(article.type) || isVideo(article.type) }"
            >
              {{ article.summary }}
            </p>
            <em v-if="!isResource(article.type)">
              <span>{{ article.category }} &bullet; </span>
              <span>
                <NuxtLink
                  :to="localePath(article.type === FORUM ? `/${FORUM}/${USER}/${article.author.slug}` : `/${AUTHOR}/${article.author.slug}`)"
                >
                  {{ article.author.nickname }}
                </NuxtLink> &bullet;
              </span>
              <span>{{ format(new Date(article.date ? convertTs(article.date) : article.published), DEFAULT_DATE_FORMAT) }}</span>
            </em>
          </IMedia>
        </IListGroupItem>
      </IListGroup>
      <IPagination v-model="currentPage" class="search-page__pagination" :items-total="totalItems" :items-per-page="itemsPerPage" />
    </template>
  </div>
</template>
<script setup>
  import { format } from 'date-fns'
  import orderBy from 'lodash/orderBy'
  import searchQuery from '~/sanity/searchContent.sanity'
  import { AUTHOR, FORUM, USER } from '~/assets/constants/types'
  import { usePagination } from '~/assets/composables/usePagination'
  import { usePosts } from '~/assets/composables/usePosts'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'
  import { mapForumSearchResult } from '~/assets/utils/map-forum-results'
  import { isExternalLink, isLibrary, isNews, isResource, isVideo } from '~/assets/utils/article-types'
  import { convertTs } from '~/assets/utils/convert-timestamp'

  const { locale, t } = useI18n()
  const route = useRoute()
  const localePath = useLocalePath()
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

  &__link {
    @include titleLink();

    margin-bottom: 5px;
  }

  &__description {
    &.no-margin {
      margin: 0;
    }
  }

  &__thumbnail,
  &__avatar {
    @include thumbnail();
  }

  &__pagination {
    @include pagination();
  }
}
</style>