<template>
  <div class="home-page" :class="{ pending: pending || loading }">
    <ILoader v-if="pending || loading" class="home-page__loader" />
    <template v-else>
      <div>
        <div>
          TOP
        </div>
        <!-- <div class="home-page__divider" /> -->
        <div>
          <h3>{{ $t("layout.forum") }}</h3>
          <template v-if="posts?.length">
            <div>
              <PostPreview
                v-for="post in posts"
                :key="post.id"
                :post="post"
                :root-path="rootPath"
                :ssr="isSSR"
                with-preview
              />
            </div>
            <NuxtLink :to="localePath('/forum')">
              {{ $t('layout.more.posts') }} &raquo;
            </NuxtLink>
          </template>
          <p v-else>{{ $t('layout.empty.forum') }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
  import latestPublicationsQuery from '~/sanity/latestPublications.sanity'
  import { usePosts } from '~/assets/composables/usePosts'
  import PostPreview from '~/components/PostPreview.vue'
  // import PublicationList from '~/components/PublicationList.vue'

  // const { $appSettings } = useNuxtApp()
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

.home-page {
  &.pending {
    @include pending();
  }

  &__loader {
    @include loader();
  }

  // &__divider {
  //   @include divider();
  // }
}
</style>