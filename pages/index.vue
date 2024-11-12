<template>
  <div class="home-page" :class="{ pending: pending || loading }">
    <ILoader v-if="pending || loading" class="home-page__loader" />
    <template v-else>
      <div>
        <div class="grid lg:grid-cols-3 gap-4 lg:gap-8">
          <PromoZone
            class="lg:col-span-3"
            :height="300"
            :zone-id="HP_ZONE_1"
            :zones="latestPublications?.promos"
          />
          <div class="lg:col-span-2">
            <h3 class="uppercase font-base font-bold text-lg tracking-widest hover:no-underline mt-4">
              {{ $t("layout.news") }}
            </h3>
            <p v-if="!latestPublications?.news?.length" v-text="$t('layout.empty.news')" />
            <template v-else>
              <PublicationBlock
                :publications="latestPublications.news"
                target="_blank"
              />
            </template>
          </div>
          <div>
            <PromoZone
              :height="900"
              :width="900"
              :zone-id="HP_ZONE_7"
              :zones="latestPublications?.promos"
            />
            <h3 class="uppercase font-base font-bold text-lg tracking-widest hover:no-underline mt-4">
              {{ $t("layout.events") }}
            </h3>
            <p v-if="!latestPublications?.events?.length" v-text="$t('layout.empty.events')" />
            <div class="grid gap-4 lg:gap-8" v-else>
              <Card
                v-for="event in latestPublications.events"
                :key="event.id"
                :date="event.date"
                :description="event.summary"
                :free="event.isEventFree"
                :end="event.end"
                :tags="event.tags"
                :title="event.title"
                :url="localePath(event.path)"
                :visual="event.visual"
              />
            </div>
          </div>
          <PromoZone
            class="lg:col-span-3"
            :height="300"
            :zone-id="HP_ZONE_2"
            :zones="latestPublications?.promos"
          />
          <div class="lg:col-span-2">
            <h3 class="uppercase font-base font-bold text-lg tracking-widest hover:no-underline mt-4">
              {{ $t("layout.scientific-library") }}
            </h3>
            <p v-if="!latestPublications?.library?.length" v-text="$t('layout.empty.library')" />
            <template v-else>
              <PublicationBlock
                :publications="latestPublications.library"
              />
            </template>
          </div>
          <div>
            <h3 class="uppercase font-base font-bold text-lg tracking-widest hover:no-underline mt-4">
              {{ $t("layout.resource") }}
            </h3>
            <p v-if="!latestPublications?.resources?.length" v-text="$t('layout.empty.resources')" />
            <div class="grid gap-4" v-else>
              <Media
                v-for="resource in latestPublications?.resources"
                :key="resource.id"
                :summary="resource.summary"
                :tags="resource.tags"
                :title="resource.title"
                :url="localePath(resource.path)"
              />
            </div>
          </div>
          <PromoZone
            class="lg:col-span-3"
            :height="300"
            :zone-id="HP_ZONE_3"
            :zones="latestPublications?.promos"
          />
          <div class="lg:col-span-2">
            <h3 class="uppercase font-base font-bold text-lg tracking-widest hover:no-underline mt-4">
              {{ $t("layout.health") }}
            </h3>
            <p v-if="!latestPublications?.health?.length" v-text="$t('layout.empty.health')" />
            <template v-else>
              <PublicationBlock
                :publications="latestPublications.health"
                target="_blank"
              />
            </template>
          </div>
          <div>
            <h3 class="uppercase font-base font-bold text-lg tracking-widest hover:no-underline mt-4">
              {{ $t("layout.directory") }}
            </h3>
            <p v-if="!latestPublications?.directory?.length" v-text="$t('layout.empty.directory')" />
            <div class="grid gap-4" v-else>
              <Media
                v-for="entry in latestPublications?.directory"
                :key="entry.id"
                :online-only="entry.onlineOnly"
                :summary="entry.summary"
                :tags="entry.tags"
                :title="entry.title"
                :url="localePath(entry.path)"
              />
            </div>
          </div>
          <PromoZone
            class="lg:col-span-3"
            :height="300"
            :zone-id="HP_ZONE_4"
            :zones="latestPublications?.promos"
          />
          <div class="lg:col-span-3">
            <h3 class="uppercase font-base font-bold text-lg tracking-widest hover:no-underline mt-4">
              {{ $t("layout.video") }}
            </h3>
            <p v-if="!latestPublications?.videos?.length" v-text="$t('layout.empty.videos')" />
            <div class="grid lg:grid-cols-3 gap-4 lg:gap-8" v-else>
              <Card
                v-for="video in latestPublications.videos"
                :key="video.id"
                :date="video.date"
                :description="video.summary"
                is-video
                :tags="video.tags"
                :title="video.title"
                :url="localePath(video.path)"
                :visual="video.thumbnail"
              />
            </div>
          </div>
          <PromoZone
            class="lg:col-span-3"
            :height="300"
            :zone-id="HP_ZONE_5"
            :zones="latestPublications?.promos"
          />
          <div class="lg:col-span-3">
            <h3 class="uppercase font-base font-bold text-lg tracking-widest hover:no-underline mt-4">
              {{ $t("layout.forum") }}
            </h3>
            <p v-text="$t('layout.empty.forum')" v-if="!forumPosts?.length" />
            <template v-else>
              <div class="grid lg:grid-cols-3 gap-4 lg:gap-8">
                <PostPreview
                  v-for="post in forumPosts"
                  :key="post.id"
                  hide-thumbnail
                  :post="post"
                  :root-path="rootPath"
                  :ssr="isSSR"
                  with-preview
                />
              </div>
              <!-- <div class="mt-4">
                <NuxtLink
                  :to="localePath('/forum')"
                  class="uppercase font-semibold text-xs tracking-widest hover:no-underline"
                >
                  {{ $t('layout.more.posts') }} &raquo;
                </NuxtLink>
              </div> -->
            </template>
          </div>
          <PromoZone
            class="lg:col-span-3"
            :height="300"
            :zone-id="HP_ZONE_6"
            :zones="latestPublications?.promos"
          />
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
  import latestPublicationsQuery from '~/sanity/latestPublications.sanity'
  // import { usePosts } from '~/assets/composables/usePosts'
  import PostPreview from '~/components/PostPreview.vue'
  import PublicationBlock from '~/components/PublicationBlock.vue'
  import Card from '~/components/Card.vue'
  import Media from '~/components/Media.vue'
  import PromoZone from '~/components/PromoZone.vue'
  import { 
    HP_ZONE_1,
    HP_ZONE_2,
    HP_ZONE_3,
    HP_ZONE_4,
    HP_ZONE_5,
    HP_ZONE_6,
    HP_ZONE_7
  } from '~/assets/constants/promo-zones'
  import { usePrisma } from '~/assets/composables/usePrisma'
  import { getGravatarUrl } from '~/assets/utils/gravatar'

  // const { $appSettings } = useNuxtApp()
  const loading = ref(true)
  const { getLatestPosts } = usePrisma()
  const { locale, t } = useI18n()
  const localePath = useLocalePath()
  // const { loading, getPosts } = usePosts()
  const posts = ref([])
  const forumPosts = computedAsync(async() => {
    if(!posts.value) {
      return []
    }

    const emails = posts.value.map(({ author }) => author.email)
    const thumbnails = await Promise.all(
      emails.map((email) => new Promise(async (resolve) => {
        const avatar = await getGravatarUrl(email)
        resolve([email, avatar])
      }))
    );

    const thumbnailMap = thumbnails.reduce((acc, val) => {
      const [email, avatar] = val;

      if(!acc[email]) {
        acc[email] = avatar
      }

      return acc
    }, {})

    return posts
      .value
      .map(({ author, categories, content, createdAt, id, title }) => {
        return {
          id,
          author: {
            id: author.id,
            username: author.profile?.name || 'USER',
          },
          description: content ? content.substr(0, 255) : null,
          published: createdAt,
          tags: categories || [],
          thumbnail: thumbnailMap[author.email] || null,
          title,
        }
      })
  }, [])

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
  // posts.value = await getPosts(0, 2)

  onMounted(async () => {
    try {
      posts.value = await getLatestPosts()
    } catch (e) {
      console.error(e)
      posts.value = []
    } finally {
      loading.value = false
    }
  })

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