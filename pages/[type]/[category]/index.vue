<template>
  <div class="category-page" :class="{ pending }">
    <ILoader v-if="pending" class="category-page__loader" />
    <NotFound v-else-if="!pending && !results.length" :category="localeCategory" />
    <template v-else>
      <h1 class="category-page__title" v-text="pageTitle" />
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
              <div v-else class="category-page__thumbnail--fallback">
                <Icon class="category-page__thumbnail--fallback-icon" name="material-symbols:broken-image-outline" />
              </div>
            </template>
            <h3 class="category-page__link">
              <NuxtLink
                :to="isExternalLink(article.type) ? article.link : localePath(article.path)"
                :target="isExternalLink(article.type) ? '_blank' : '_self'"
              >
                <span v-if="isNews(article.type)">{{ article.source }}: </span>{{ article.title }}
              </NuxtLink>
            </h3>
            <p
              v-if="isResource(article.type) && article.description"
              class="category-page__description"
            >
              {{ article.description }}
            </p>
            <em v-if="!isResource(article.type)">
              <span>{{ article.category }} &bullet; </span>
              <span><NuxtLink :to="localePath(`/${AUTHOR}/${article.author.slug}`)">{{ article.author.nickname }}</NuxtLink> &bullet; </span>
              <span>{{ format(new Date(article.published), DEFAULT_DATE_FORMAT) }}</span>
            </em>
          </IMedia>
        </IListGroupItem>
      </IListGroup>
      <IPagination v-model="currentPage" class="category-page__pagination" :items-total="totalItems" :items-per-page="itemsPerPage" />
    </template>
  </div>
</template>
<script setup>
  import { format } from "date-fns";
  import publicationsByCategoryQuery from "~/sanity/publicationsByCategory.sanity";
  import { AUTHOR } from "~/assets/constants/types";
  import { usePagination } from "~/assets/composables/usePagination";
  import { DEFAULT_DATE_FORMAT } from "~/assets/constants/date-formats";
  import { isExternalLink, isNews, isResource } from '~/assets/utils/article-types'

  const { locale, t } = useI18n();
  const { params } = useRoute();
  const { type, category } = params;
  const localePath = useLocalePath();
  const localeType = computed(() => t(`layout.${type}`));

  const { currentPage, itemsPerPage, startItem, endItem } = usePagination();

  const { data, pending } = useLazySanityQuery(publicationsByCategoryQuery, {
    locale, 
    articleCategory: category,
    articleType: type, 
    categoryTable: `${type}Category`,
  });
  const results = computed(() => data?.value?.results || []);
  const totalItems = computed(() => data?.value?.total || 0);
  const visibleItems = computed(() => results.value.slice(startItem.value, endItem.value));
  const localeCategory = computed(() => data?.value?.categoryLabel?.label || category);
  const pageTitle = computed(() => `${localeType.value} / ${localeCategory.value}`);

  useHead({
    meta: [
      { name: "description", content: t("list.description") },
    ],
    title: t("list.categoryTitle", { category: localeCategory.value, type: localeType.value })
  });
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.category-page {
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
  }

  &__thumbnail {
    @include thumbnail();
  }

  &__pagination {
    @include pagination();
  }
}
</style>