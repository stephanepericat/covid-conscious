<template>
  <div class="home-page">
    <h1 class="home-page__title" v-text="$t('home.pageTitle')" />
  </div>
</template>
<script setup>
const { t } = useI18n();
useHead({
  meta: [
    { name: "description", content: t("home.description") },
  ],
  title: t("home.title")
});

const { locale } = useI18n();
</script>