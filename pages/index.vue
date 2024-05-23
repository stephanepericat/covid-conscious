<template>
  <div class="home-page" :class="{ pending: pending || loading }">
    <ILoader v-if="pending || loading" class="home-page__loader" />
    <template v-else>
      <div class="home-page__container">
        <div class="home-page__container--top">
          TOP
        </div>
        <div class="home-page__divider" />
        <div class="home-page__container--forum">
          <div class="home-page__container--forum-content">
            <h3 class="home-page__sub-title">{{ $t("layout.forum") }}</h3>
            <template v-if="posts?.length">
              <div class="home-page__container--forum-posts">
                <PostPreview
                  v-for="post in posts"
                  class="home-page__container--forum-post"
                  hide-thumbnail
                  :key="post.id"
                  :post="post"
                  :root-path="rootPath"
                  :ssr="isSSR"
                  with-preview
                />
              </div>
              <NuxtLink class="home-page__more" :to="localePath('/forum')">
                {{ $t('layout.more.posts') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.forum') }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
  import latestPublicationsQuery from '~/sanity/latestPublications.sanity'
  import { usePosts } from '~/assets/composables/usePosts'
  import PostPreview from '~/components/PostPreview.vue'
  // import PublicationList from '~/components/PublicationList.vue'

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

  // const showBottomBlock = computed(() => $appSettings.SHOW_EDUCATION && $appSettings.SHOW_DIRECTORY)

  const { data: latestPublications, pending } = useLazySanityQuery(latestPublicationsQuery, { locale })
  posts.value = await getPosts(0, 2)

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

  &__sub-title {
    @include eyebrow();

    font-size: 18px;
    font-weight: 700;
    letter-spacing: .1rem;
  }

  &__container {}

  &__divider {
    border-bottom: 1px solid var(--list-group--border-bottom-color, var(--border-bottom-color));
    margin: 30px 0 10px 0;
  }

  &__more {
    @include eyebrow();

    font-size: 12px;
    font-weight: 600;

    &.padded {
      padding-left: var(--list-group--padding-left, var(--padding-left));
    }
  }

  &__video-player {
    padding: 15px 0 20px 0;
  }

  @include breakpoint-down('md') {
    &__container {}
  }
}
</style>