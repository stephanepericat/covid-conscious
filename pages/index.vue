<template>
  <div class="home-page" :class="{ pending: pending || loading }">
    <ILoader v-if="pending || loading" class="home-page__loader" />
    <template v-else>
      <div>
        <div class="grid lg:grid-cols-3 gap-4 lg:gap-8">
          <div class="lg:col-span-2">
            <h3 class="uppercase font-base font-bold text-base tracking-widest hover:no-underline mt-4">
              {{ $t("layout.news") }}
            </h3>
          </div>
          <div>
            <h3 class="uppercase font-base font-bold text-base tracking-widest hover:no-underline mt-4">
              {{ $t("layout.events") }}
            </h3>
          </div>
          <div class="lg:col-span-2">
            <h3 class="uppercase font-base font-bold text-base tracking-widest hover:no-underline mt-4">
              {{ $t("layout.scientific-library") }}
            </h3>
          </div>
          <div>
            <h3 class="uppercase font-base font-bold text-base tracking-widest hover:no-underline mt-4">
              {{ $t("layout.resource") }}
            </h3>
          </div>
          <div class="lg:col-span-2">
            <h3 class="uppercase font-base font-bold text-base tracking-widest hover:no-underline mt-4">
              {{ $t("layout.health") }}
            </h3>
          </div>
          <div>
            <h3 class="uppercase font-base font-bold text-base tracking-widest hover:no-underline mt-4">
              {{ $t("layout.directory") }}
            </h3>
          </div>
          <div class="lg:col-span-3">
            <h3 class="uppercase font-base font-bold text-base tracking-widest hover:no-underline mt-4">
              {{ $t("layout.video") }}
            </h3>
          </div>
          <div class="lg:col-span-3">
            <h3 class="uppercase font-base font-bold text-base tracking-widest hover:no-underline mt-4">
              {{ $t("layout.forum") }}
            </h3>
            <template v-if="posts?.length">
              <div class="grid lg:grid-cols-3 gap-4 lg:gap-8">
                <PostPreview
                  v-for="post in posts"
                  :key="post.id"
                  hide-thumbnail
                  :post="post"
                  :root-path="rootPath"
                  :ssr="isSSR"
                  with-preview
                />
              </div>
              <div class="mt-4">
                <NuxtLink
                  :to="localePath('/forum')"
                  class="uppercase font-semibold text-xs tracking-widest hover:no-underline"
                >
                  {{ $t('layout.more.posts') }} &raquo;
                </NuxtLink>
              </div>
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
  import Card from '~/components/Card.vue'
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
}
</style>