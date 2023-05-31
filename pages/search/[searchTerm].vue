<template>
  <div class="search-page">
    <h1>{{ $t("search.pageTitle", { searchTerm }) }}</h1>
    <pre>
      {{ searchResults }}
    </pre>
  </div>
</template>
<script setup>
import searchQuery from "~/sanity/searchContent.sanity";

const { locale, t } = useI18n();
const route = useRoute();
const searchTerm = computed(() => route.params.searchTerm);

useHead({
  meta: [
    { name: "description", content: t("search.description") },
  ],
  title: t("search.title", { searchTerm: searchTerm.value })
});

const { data: searchResults } = useSanityQuery(searchQuery, { locale, searchTerm });
</script>