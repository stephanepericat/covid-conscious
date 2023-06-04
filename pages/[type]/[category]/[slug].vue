<template>
  <div class="article-page" :class="{ loading: !article }">
    <template v-if="article">
      <h1 v-text="article.title" class="article-page__title" />

      <IMedia class="article-page__author">
        <template #image>
          <img
            class="article-page__author--thumbnail"
            :src="article.author.avatar"
            :alt="article.author.nickname"
          />
        </template>
        <h5 class="article-page__author--name">
          <NuxtLink :text="article.author.nickname" :to="`/authors/${article.author.slug}`" />
        </h5>
        <p class="article-page__info">
          <span class="article-page__info--category">{{ type }} / {{ article.category }} / {{ format(new Date(article.published), "Y-MM-dd") }} ({{ $t("article.updated") }}: {{ format(new Date(article.updated), "Y-MM-dd") }})</span>
        </p>
      </IMedia>

      <section class="article-page__body">
        <SanityContent :blocks="article.body" />
      </section>
    </template>
    <ILoader v-else class="article-page__loader" />
  </div>
</template>
<script setup>
  import { format } from "date-fns";
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
<style lang="scss" scoped>
.article-page {
  &.loading {
    display: flex;
    justify-content: center;
  }

  &__loader {
    margin: 40px auto;
  }

  &__title {
    font-weight: 500;
    margin-bottom: 40px;
  }

  &__info--category,
  &__author--name {
    font-weight: 500;
    letter-spacing: .1rem;
    text-transform: uppercase;
  }

  &__author {
    margin-bottom: 40px;

    &--thumbnail {
      width: 50px;
      height: 50px;
    }
  }

  &__info {
    &--category {
      font-weight: 200;
    }
  }

  &__body {
    font-size: 1.25rem;
    font-weight: 300;

    :deep(strong) {
      font-weight: 500;
    }
  }
}
</style>
