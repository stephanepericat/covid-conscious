<template>
  <div class="home-page" :class="{ pending }">
    <ILoader v-if="pending" class="home-page__loader" />
    <template v-else>
      <h1 class="home-page__title" v-text="$t('home.pageTitle')" />
      <div class="home-page__container">
        <section class="home-page__container--card">
          <h4>{{ $t("layout.news") }}</h4>
          <IListGroup size="sm" :border="false">
            <IListGroupItem v-for="article in latestPublications.news">
              <IMedia>
                <template #image>
                  <SanityImage
                    v-if="article.thumbnail"
                    :asset-id="article.thumbnail"
                    auto="format"
                    :h="80"
                    :w="80"
                  />
                  <div v-else class="home-page__thumbnail--fallback">
                    <Icon class="home-page__thumbnail--fallback-icon" name="material-symbols:broken-image-outline" />
                  </div>
                </template>
                <h3 class="home-page__link">
                  <NuxtLink :to="article.link" target="_blank">{{ article.source }}: {{ article.title }}</NuxtLink>
                </h3>
                <em>
                  <span>{{ article.category }} &bullet; </span>
                  <span><NuxtLink :to="localePath(`/${AUTHOR}/${article.author.slug}`)">{{ article.author.nickname }}</NuxtLink> &bullet; </span>
                  <span>{{ format(new Date(article.published), DEFAULT_DATE_FORMAT) }}</span>
                </em>
              </IMedia>
            </IListGroupItem>
          </IListGroup>
        </section>
        <section class="home-page__container--card">
          <h4>{{ $t("layout.product") }}</h4>
          <IListGroup size="sm" :border="false">
            <IListGroupItem v-for="article in latestPublications.products">
              <IMedia>
                <template #image>
                  <SanityImage
                    v-if="article.thumbnail"
                    :asset-id="article.thumbnail"
                    auto="format"
                    :h="80"
                    :w="80"
                  />
                  <div v-else class="home-page__thumbnail--fallback">
                    <Icon class="home-page__thumbnail--fallback-icon" name="material-symbols:broken-image-outline" />
                  </div>
                </template>
                <h3 class="home-page__link">
                  <NuxtLink :to="localePath(article.link)">{{ article.title }}</NuxtLink>
                </h3>
                <em>
                  <span>{{ article.category }} &bullet; </span>
                  <span><NuxtLink :to="localePath(`/${AUTHOR}/${article.author.slug}`)">{{ article.author.nickname }}</NuxtLink> &bullet; </span>
                  <span>{{ format(new Date(article.published), DEFAULT_DATE_FORMAT) }}</span>
                </em>
              </IMedia>
            </IListGroupItem>
          </IListGroup>
        </section>
        <section class="home-page__container--card">
          <h4>{{ $t("layout.community") }}</h4>
          <IListGroup size="sm" :border="false">
            <IListGroupItem v-for="article in latestPublications.community">
              <IMedia>
                <template #image>
                  <SanityImage
                    v-if="article.thumbnail"
                    :asset-id="article.thumbnail"
                    auto="format"
                    :h="80"
                    :w="80"
                  />
                  <div v-else class="home-page__thumbnail--fallback">
                    <Icon class="home-page__thumbnail--fallback-icon" name="material-symbols:broken-image-outline" />
                  </div>
                </template>
                <h3 class="home-page__link">
                  <NuxtLink :to="localePath(article.link)">{{ article.title }}</NuxtLink>
                </h3>
                <em>
                  <span>{{ article.category }} &bullet; </span>
                  <span><NuxtLink :to="localePath(`/${AUTHOR}/${article.author.slug}`)">{{ article.author.nickname }}</NuxtLink> &bullet; </span>
                  <span>{{ format(new Date(article.published), DEFAULT_DATE_FORMAT) }}</span>
                </em>
              </IMedia>
            </IListGroupItem>
          </IListGroup>
        </section>
        <section class="home-page__container--card">
          <h4>{{ $t("layout.education") }}</h4>
          <IListGroup size="sm" :border="false">
            <IListGroupItem v-for="article in latestPublications.learn">
              <IMedia>
                <template #image>
                  <SanityImage
                    v-if="article.thumbnail"
                    :asset-id="article.thumbnail"
                    auto="format"
                    :h="80"
                    :w="80"
                  />
                  <div v-else class="home-page__thumbnail--fallback">
                    <Icon class="home-page__thumbnail--fallback-icon" name="material-symbols:broken-image-outline" />
                  </div>
                </template>
                <h3 class="home-page__link">
                  <NuxtLink :to="localePath(article.link)">{{ article.title }}</NuxtLink>
                </h3>
                <em>
                  <span>{{ article.category }} &bullet; </span>
                  <span><NuxtLink :to="localePath(`/${AUTHOR}/${article.author.slug}`)">{{ article.author.nickname }}</NuxtLink> &bullet; </span>
                  <span>{{ format(new Date(article.published), DEFAULT_DATE_FORMAT) }}</span>
                </em>
              </IMedia>
            </IListGroupItem>
          </IListGroup>
        </section>
      </div>
    </template>
  </div>
</template>
<script setup>
  import { format } from "date-fns";
  import latestPublicationsQuery from '~/sanity/latestPublications.sanity';
  import { AUTHOR } from "~/assets/constants/types";
  import { DEFAULT_DATE_FORMAT } from "~/assets/constants/date-formats";

  const { locale, t } = useI18n();
  const localePath = useLocalePath();

  useHead({
    meta: [
      { name: "description", content: t("home.description") },
    ],
    title: t("home.title")
  });

  const { data: latestPublications, pending } = useLazySanityQuery(latestPublicationsQuery, { locale });
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";
@import '@inkline/inkline/css/mixins';

.home-page {
  &.pending {
    @include pending();
  }

  &__loader {
    @include loader();
  }

  &__link {
    @include titleLink();
  }

  &__container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    position: relative;
    width: 100%;

    &--card {
      width: calc(50% - 10px);
      margin: 10px 0;
    }
  }

  &__thumbnail {
    @include thumbnail();
  }

  @include breakpoint('md') {
    &__container {
      &--card {
        width: 100%;
        margin: 0 0 40px 0;
      }
    }
  }
}
</style>