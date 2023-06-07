<template>
  <div class="type-page" :class="{ pending, type }">
    <ILoader v-if="pending" class="type-page__loader" />
    <template v-else>
      <h1 class="type-page__title" v-text="localeType" />
      <IListGroup size="sm" :border="false">
        <IListGroupItem v-for="article in visibleItems">
          <IMedia>
            <template #image>
              <SanityImage
                v-if="article.thumbnail"
                :asset-id="article.thumbnail"
                auto="format"
                :h="80"
                :w="80"
              />
              <div v-else class="type-page__thumbnail--fallback">
                <Icon class="type-page__thumbnail--fallback-icon" name="material-symbols:broken-image-outline" />
              </div>
            </template>
            <h3 class="type-page__link">
              <NuxtLink
                :to="article.link || localePath(article.path)"
                :target="article.link ? '_blank' : '_self'"
              >
                <span v-if="article.type === 'link'">{{ article.source }}: </span>{{ article.title }}
              </NuxtLink>
            </h3>
            <em>
              <span>{{ article.category }} &bullet; </span>
              <span><NuxtLink :to="localePath(`/${AUTHOR}/${article.author.slug}`)">{{ article.author.nickname }}</NuxtLink> &bullet; </span>
              <span>{{ format(new Date(article.published), DEFAULT_DATE_FORMAT) }}</span>
            </em>
          </IMedia>
        </IListGroupItem>
      </IListGroup>
      <IPagination v-model="currentPage" class="type-page__pagination" :items-total="totalItems" :items-per-page="itemsPerPage" />
    </template>
  </div>
</template>
<script setup>
  import { format } from "date-fns";
  import publicationsByTypeQuery from "~/sanity/publicationsByType.sanity";
  import { AUTHOR, LINK, NEWS } from "~/assets/constants/types";
  import { usePagination } from "~/assets/composables/usePagination";
  import { DEFAULT_DATE_FORMAT } from "~/assets/constants/date-formats";

  const { locale, t } = useI18n();
  const { params } = useRoute();
  const { type } = params;
  const localePath = useLocalePath();
  const localeType = computed(() => t(`layout.${type}`));

  useHead({
    meta: [
      { name: "description", content: t("list.description") },
    ],
    title: t("list.typeTitle", { type: localeType.value })
  });

  const { currentPage, itemsPerPage, startItem, endItem } = usePagination();

  const articleType = computed(() => type === NEWS ? LINK : type);
  const { data, pending } = useLazySanityQuery(publicationsByTypeQuery, { locale, articleType: articleType.value });
  const results = computed(() => data?.value?.results || []);
  const totalItems = computed(() => data?.value?.total || 0);
  const visibleItems = computed(() => results.value.slice(startItem.value, endItem.value));
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.type-page {
  &.pending {
    @include pending();
  }

  &__title {
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