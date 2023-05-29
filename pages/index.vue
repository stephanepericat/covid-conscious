<template>
  <div class="home-page">
    <h1 class="home-page__title" v-text="$t('home.pageTitle')" />
    <div class="home-page__container">
      <section class="home-page__container--card">
        <h4>{{ $t("layout.news") }}</h4>
        <IListGroup size="sm" :border="false">
          <IListGroupItem v-for="article in latestPublications.news">
            <IMedia>
              <h3>
                <NuxtLink :to="article.link" target="_blank">{{ article.title }}</NuxtLink>
              </h3>
              <em>
                <span>{{ article.category }} &bullet; </span>
                <span><NuxtLink :to="`/authors/${article.author.slug}`">{{ article.author.nickname }}</NuxtLink> &bullet; </span>
                <span>{{ format(new Date(article.published), "Y-MM-dd") }}</span>
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
              <h3>
                <NuxtLink :to="article.link">{{ article.title }}</NuxtLink>
              </h3>
              <em>
                <span>{{ article.category }} &bullet; </span>
                <span><NuxtLink :to="`/authors/${article.author.slug}`">{{ article.author.nickname }}</NuxtLink> &bullet; </span>
                <span>{{ format(new Date(article.published), "Y-MM-dd") }}</span>
              </em>
            </IMedia>
          </IListGroupItem>
        </IListGroup>
      </section>
      <section class="home-page__container--card">
        <h4>{{ $t("layout.learn") }}</h4>
        <IListGroup size="sm" :border="false">
          <IListGroupItem v-for="article in latestPublications.learn">
            <IMedia>
              <h3>
                <NuxtLink :to="article.link">{{ article.title }}</NuxtLink>
              </h3>
              <em>
                <span>{{ article.category }} &bullet; </span>
                <span><NuxtLink :to="`/authors/${article.author.slug}`">{{ article.author.nickname }}</NuxtLink> &bullet; </span>
                <span>{{ format(new Date(article.published), "Y-MM-dd") }}</span>
              </em>
            </IMedia>
          </IListGroupItem>
        </IListGroup>
      </section>
      <section class="home-page__container--card">
        <h4>{{ $t("layout.products") }}</h4>
        <IListGroup size="sm" :border="false">
          <IListGroupItem v-for="article in latestPublications.products">
            <IMedia>
              <h3>
                <NuxtLink :to="article.link">{{ article.title }}</NuxtLink>
              </h3>
              <em>
                <span>{{ article.category }} &bullet; </span>
                <span><NuxtLink :to="`/authors/${article.author.slug}`">{{ article.author.nickname }}</NuxtLink> &bullet; </span>
                <span>{{ format(new Date(article.published), "Y-MM-dd") }}</span>
              </em>
            </IMedia>
          </IListGroupItem>
        </IListGroup>
      </section>
    </div>
  </div>
</template>
<script setup>
import latestPublicationsQuery from '~/sanity/latestPublications';
import { format } from "date-fns";

const { locale, t } = useI18n();

useHead({
  meta: [
    { name: "description", content: t("home.description") },
  ],
  title: t("home.title")
});

const { data: latestPublications } = useSanityQuery(latestPublicationsQuery, { locale });
</script>
<style lang="scss" scoped>
.home-page {
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
}
</style>