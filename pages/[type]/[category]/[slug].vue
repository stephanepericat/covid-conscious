<template>
  <div class="article-page">
    {{ type }} = {{ category }} - {{ slug }}
    <!-- <IMedia>
      <template v-if="article.thumbnail" #image>
        <img
          v-if="article.thumbnail"
          class="article-page__thumbnail"
          :src="article.thumbnail"
          :alt="article.title"
        />
      </template>
      <h3>
        <span v-if="article.type === 'link'">{{ article.source }}: </span>{{ article.title }}
      </h3>
      <em>
        <span>{{ article.category }} &bullet; </span>
        <span><NuxtLink :to="`/authors/${article.author.slug}`">{{ article.author.nickname }}</NuxtLink> &bullet; </span>
        <span>{{ format(new Date(article.published), "Y-MM-dd") }}</span>
      </em>
    </IMedia> -->
  </div>
</template>
<script setup>
  import publicationQuery from "~/sanity/publication.sanity";

  const { locale } = useI18n();
  const { params } = useRoute();
  const { type, category, slug } = params;

  const { data: article } = useSanityQuery(publicationQuery, {
    category,
    locale,
    slug,
    type,
  });
</script>
<style lang="scss" scoped></style>
