<template>
  <div class="search-page" :class="{ pending }">
    <ILoader v-if="pending" class="search-page__loader" />
    <template v-else>
      <h1>{{ $t("search.pageTitle", { searchTerm, totalItems }) }}</h1>
      <IListGroup size="sm" :border="false">
        <IListGroupItem v-for="article in visibleItems">
          <IMedia>
            <template #image>
              <img
                v-if="article.thumbnail"
                class="search-page__thumbnail"
                :src="article.thumbnail"
                :alt="article.title"
              />
              <div v-else class="search-page__thumbnail--fallback">
                <Icon class="search-page__thumbnail--fallback-icon" name="material-symbols:broken-image-outline" />
              </div>
            </template>
            <h3>
              <NuxtLink
                :to="article.link || article.path"
                :target="article.link ? '_blank' : '_self'"
              >
                <span v-if="article.type === 'link'">{{ article.source }}: </span>{{ article.title }}
              </NuxtLink>
            </h3>
            <em>
              <span>{{ article.category }} &bullet; </span>
              <span><NuxtLink :to="`/${AUTHOR}/${article.author.slug}`">{{ article.author.nickname }}</NuxtLink> &bullet; </span>
              <span>{{ format(new Date(article.published), "Y-MM-dd") }}</span>
            </em>
          </IMedia>
        </IListGroupItem>
      </IListGroup>
      <IPagination v-model="currentPage" class="search-page__pagination" :items-total="totalItems" :items-per-page="itemsPerPage" />
    </template>
  </div>
</template>
<script setup>
import { format } from "date-fns";
import searchQuery from "~/sanity/searchContent.sanity";
import { AUTHOR } from "~/assets/constants/types";

const { locale, t } = useI18n();
const route = useRoute();
const searchTerm = computed(() => route.params.searchTerm);

useHead({
  meta: [
    { name: "description", content: t("search.description") },
  ],
  title: t("search.title", { searchTerm: searchTerm.value })
});

const currentPage = ref(1);
const itemsPerPage = ref(4);
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endItem = computed(() => startItem.value + itemsPerPage.value);

const { data, pending } = useLazySanityQuery(searchQuery, { locale, searchTerm });
const searchResults = computed(() => data?.value?.results || []);
const totalItems = computed(() => data?.value?.total || 0);
const visibleItems = computed(() => searchResults.value.slice(startItem.value, endItem.value));
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.search-page {
  &.pending {
    @include pending();
  }

  &__loader {
    @include loader();
  }

  &__thumbnail {
    @include thumbnail();
  }

  &__pagination {
    @include pagination();
  }
}
</style>