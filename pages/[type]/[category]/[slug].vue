<template>
  <div class="article-page" :class="{ pending }">
    <ILoader v-if="pending" class="article-page__loader" />
    <template v-else-if="!pending && article">
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
          <NuxtLink :text="article.author.nickname" :to="`/${AUTHOR}/${article.author.slug}`" />
        </h5>
        <p class="article-page__info">
          <span class="article-page__info--category">{{ type }} / {{ article.category }} / {{ format(new Date(article.published), "Y-MM-dd") }} ({{ $t("article.updated") }}: {{ format(new Date(article.updated), "Y-MM-dd") }})</span>
        </p>
      </IMedia>

      <section class="article-page__body">
        <SanityContent :blocks="article.body" />
        <template v-if="type === COMMUNITY && article.info">{{ article.info }}</template>
      </section>
    </template>
  </div>
</template>
<script setup>
  import { format } from "date-fns";
  import { AUTHOR, COMMUNITY } from "~/assets/constants/types";
  import publicationQuery from "~/sanity/publication.sanity";

  const { locale } = useI18n();
  const { params } = useRoute();
  const { type, category, slug } = params;

  const { data: article, pending } = useLazySanityQuery(publicationQuery, {
    category,
    locale,
    slug,
    type,
  });
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.article-page {
  &.pending {
    @include pending();
  }

  &__loader {
    @include loader();
  }

  &__title {
    font-weight: 500;
    margin-bottom: 40px;
  }

  &__info--category,
  &__author--name {
    @include eyebrow();

    font-weight: 500;
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
