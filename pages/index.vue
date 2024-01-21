<template>
  <div class="home-page" :class="{ pending: pending || loading }">
    <ILoader v-if="pending || loading" class="home-page__loader" />
    <template v-else>
      <h1 class="home-page__title" v-text="$t('home.pageTitle')" />
      <div class="home-page__container">
        <div class="home-page__container--top">
          <section class="home-page__container--news">
            <h3 class="home-page__sub-title">{{ $t("layout.news") }}</h3>
            <template v-if="latestPublications?.news?.length">
              <PublicationList
                :items="latestPublications.news"
              />
              <NuxtLink class="home-page__more" :to="localePath('/news')">
                {{ $t('layout.more.news') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.news') }}</p>
          </section>
          <section class="home-page__container--card">
            <h3 class="home-page__sub-title">{{ $t("layout.forum") }}</h3>
            <template v-if="posts?.length">
              <ForumList
                :posts="posts"
                :root-path="rootPath"
                :ssr="isSSR"
              />
              <NuxtLink class="home-page__more" :to="localePath('/forum')">
                {{ $t('layout.more.posts') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.forum') }}</p>
          </section>
        </div>
        <div class="home-page__divider" />
        <div class="home-page__container--mid">
          <section class="home-page__container--library">
            <h3 class="home-page__sub-title">{{ $t("layout.scientific-library") }}</h3>
            <template v-if="latestPublications?.library?.length">
              <PublicationList
                :items="latestPublications.library"
              />
              <NuxtLink class="home-page__more" :to="localePath('/scientific-library')">
                {{ $t('layout.more.articles') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.library') }}</p>
          </section>
          <section class="home-page__container--card">
            <h3 class="home-page__sub-title">{{ $t("layout.resource") }}</h3>
            <template v-if="latestPublications?.resources?.length">
              <PublicationList
                :hide-thumbnail="$appSettings.HIDE_RESOURCES_THUMBNAIL"
                :items="latestPublications.resources"
              />
              <NuxtLink class="home-page__more" :to="localePath('/resource')">
                {{ $t('layout.more.resources') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.resources') }}</p>
          </section>
        </div>
        <div class="home-page__divider" />
        <div class="home-page__container--videos">
          <div class="home-page__container--videos-content">
            <h3 class="home-page__sub-title">{{ $t("layout.video") }}</h3>
            <template v-if="latestPublications?.videos?.length">
              <div class="home-page__container--videos-mobile">
                <PublicationList
                  :items="latestPublications.videos"
                />
              </div>
              <div class="home-page__container--videos-desktop">
                <VideoPlayer
                  :videos="latestPublications.videos"
                />
              </div>
              <NuxtLink class="home-page__more" :to="localePath('/video')">
                {{ $t('layout.more.videos') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.videos') }}</p>
          </div>
        </div>
        <div v-if="showBottomBlock" class="home-page__divider" />
        <div v-if="showBottomBlock" class="home-page__container--other">
          <section class="home-page__container--card">
            <h3 class="home-page__sub-title">{{ $t("layout.product") }}</h3>
            <template v-if="latestPublications?.products.length">
              <PublicationList
                :items="latestPublications.products"
              />
              <NuxtLink class="home-page__more" :to="localePath('/product')">
                {{ $t('layout.more.articles') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.product') }}</p>
          </section>
          <section class="home-page__container--card">
            <h3 class="home-page__sub-title">{{ $t("layout.community") }}</h3>
            <template v-if="latestPublications?.community?.length">
              <PublicationList
                :items="latestPublications.community"
              />
              <NuxtLink class="home-page__more" :to="localePath('/community')">
                {{ $t('layout.more.articles') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.community') }}</p>
          </section>
          <section class="home-page__container--card">
            <h3 class="home-page__sub-title">{{ $t("layout.education") }}</h3>
            <template v-if="latestPublications?.learn?.length">
              <PublicationList
                :items="latestPublications.learn"
              />
              <NuxtLink class="home-page__more" :to="localePath('/education')">
                {{ $t('layout.more.articles') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.education') }}</p>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
  import latestPublicationsQuery from '~/sanity/latestPublications.sanity'
  import { usePosts } from '~/assets/composables/usePosts'
  import PublicationList from '~/components/PublicationList.vue'
  import ForumList from '~/components/ForumList.vue'
  import VideoPlayer from '~/components/VideoPlayer.vue'

  const { $appSettings } = useNuxtApp()
  const { locale, t } = useI18n()
  const localePath = useLocalePath()
  const { loading, getPosts } = usePosts()
  const posts = ref([])
  const config = useRuntimeConfig()
  const rootPath = computed(() => config.public.supabaseForum.rootPath)
  const isSSR = computed(() => !process.client)

  useHead({
    meta: [
      { name: 'description', content: t('home.description') },
    ],
    title: t('home.title')
  })

  const showBottomBlock = computed(() => $appSettings.SHOW_EDUCATION && $appSettings.SHOW_COMMUNITY)

  const { data: latestPublications, pending } = useLazySanityQuery(latestPublicationsQuery, { locale })
  posts.value = await getPosts(0, 4)

  umTrackView()
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

  &__title {
    @include title();
  }

  &__container {
    &--top,
    &--mid,
    &--videos,
    &--other {
      display: flex;
    }

    &--news,
    &--library {
      width: calc(67% - 10px);
    }

    &--card {
      width: calc(33% - 10px);
    }

    &--videos {
      &-content {
        width: 100%;
      }

      &-mobile {
        display: none;
      }
    }

    &--news,
    &--library,
    &--card,
    &--videos-content {
      margin: 10px;
    }
  }

  &__divider {
    border-bottom: 1px solid var(--list-group--border-bottom-color, var(--border-bottom-color));
    margin: 30px 0 10px 0;
  }

  &__more {
    padding-left: var(--list-group--padding-left, var(--padding-left));
  }

  @include breakpoint-down('md') {
    &__container {
      &--top,
      &--mid,
      &--other {
        flex-direction: column;
      }

      &--news,
      &--library,
      &--card {
        width: 100%;
      }

      &--videos {
        &-desktop {
          display: none;
        }

        &-mobile {
          display: block;
        }
      }
    }
  }
}
</style>