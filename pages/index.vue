<template>
  <div class="home-page">
    <h1 class="home-page__title" v-text="$t('home.pageTitle')" />
    <pre>{{ latestPublications }}</pre>
  </div>
</template>
<script setup>
import latestPublicationsQuery from '~/sanity/latestPublications';

const { locale, t } = useI18n();

useHead({
  meta: [
    { name: "description", content: t("home.description") },
  ],
  title: t("home.title")
});

const { data: latestPublications } = useSanityQuery(latestPublicationsQuery, { locale });
</script>