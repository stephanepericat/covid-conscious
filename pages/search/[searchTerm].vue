<template>
  <h1>{{ $t("search.pageTitle", { searchTerm }) }}</h1>
</template>
<script setup>
const { locale, t } = useI18n();
const route = useRoute();
const searchTerm = computed(() => route.params.searchTerm);

useHead({
  meta: [
    { name: "description", content: t("search.description") },
  ],
  title: t("search.title", { searchTerm: searchTerm.value })
});
</script>