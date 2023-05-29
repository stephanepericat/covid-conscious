<template>
  <ul>
    <li v-for="cat in data" :key="cat._createdAt">{{ cat.name[locale] }}</li>
  </ul>
</template>
<script setup>
import query from "~/sanity/productCategories.sanity";

const { locale } = useI18n();
const { data, refresh } = useSanityQuery(query, { locale });
</script>