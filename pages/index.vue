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
              <IListGroup size="sm" :border="false">
                <IListGroupItem v-for="article in latestPublications.news">
                  <IMedia>
                    <template #image>
                      <SanityImage
                        v-if="article.thumbnail"
                        :asset-id="article.thumbnail"
                        fit="crop"
                        crop="entropy"
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
                      <span>{{ format(new Date(article.date ? convertTs(article.date) : article.published), DEFAULT_DATE_FORMAT) }}</span>
                    </em>
                  </IMedia>
                </IListGroupItem>
              </IListGroup>
              <NuxtLink class="home-page__more" :to="localePath('/news')">
                {{ $t('layout.more.news') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.news') }}</p>
          </section>
          <section class="home-page__container--card">
            <h3 class="home-page__sub-title">{{ $t("layout.forum") }}</h3>
            <template v-if="posts?.length">
              <IListGroup size="sm" :border="false">
                <IListGroupItem v-for="post in posts">
                  <IMedia>
                    <template #image>
                      <div class="home-page__thumbnail--fallback">
                      <ClientOnly>
                        <img
                          v-if="post.avatar"
                          class="home-page__thumbnail"
                          :src="post.avatar"
                        >
                      </ClientOnly>
                      <Icon v-if="!post.avatar || isSSR" class="home-page__thumbnail--fallback-icon" name="material-symbols:broken-image-outline" />
                    </div>
                    </template>
                    <h3 class="home-page__link">
                      <NuxtLink :to="localePath(`${rootPath}/post/${post.id}`)">{{ post.headline }}</NuxtLink>
                    </h3>
                    <em>
                      <span>{{ $t(`forum.create.categories.${post.topic}`) }} &bullet; </span>
                      <span><NuxtLink :to="localePath(`${rootPath}/user/${post.profiles.id}`)">{{ post.profiles.username }}</NuxtLink> &bullet; </span>
                      <span>{{ format(new Date(post.created_at), DEFAULT_DATE_FORMAT) }}</span>
                    </em>
                  </IMedia>
                </IListGroupItem>
              </IListGroup>
              <NuxtLink class="home-page__more" :to="localePath('/forum')">
                {{ $t('layout.more.posts') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.forum') }}</p>
          </section>
        </div>
        <div class="home-page__container--other">
          <section class="home-page__container--card">
            <h3 class="home-page__sub-title">{{ $t("layout.product") }}</h3>
            <template v-if="latestPublications?.products.length">
              <IListGroup size="sm" :border="false">
                <IListGroupItem v-for="article in latestPublications.products">
                  <IMedia>
                    <template #image>
                      <SanityImage
                        v-if="article.thumbnail"
                        :asset-id="article.thumbnail"
                        fit="crop"
                        crop="entropy"
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
              <NuxtLink class="home-page__more" :to="localePath('/product')">
                {{ $t('layout.more.articles') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.product') }}</p>
          </section>
          <section class="home-page__container--card">
            <h3 class="home-page__sub-title">{{ $t("layout.community") }}</h3>
            <template v-if="latestPublications?.community?.length">
              <IListGroup size="sm" :border="false">
                <IListGroupItem v-for="article in latestPublications.community">
                  <IMedia>
                    <template #image>
                      <SanityImage
                        v-if="article.thumbnail"
                        :asset-id="article.thumbnail"
                        fit="crop"
                        crop="entropy"
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
              <NuxtLink class="home-page__more" :to="localePath('/community')">
                {{ $t('layout.more.articles') }} &raquo;
              </NuxtLink>
            </template>
            <p v-else>{{ $t('layout.empty.community') }}</p>
          </section>
          <section class="home-page__container--card">
            <h3 class="home-page__sub-title">{{ $t("layout.education") }}</h3>
            <template v-if="latestPublications?.learn?.length">
              <IListGroup size="sm" :border="false">
                <IListGroupItem v-for="article in latestPublications.learn">
                  <IMedia>
                    <template #image>
                      <SanityImage
                        v-if="article.thumbnail"
                        :asset-id="article.thumbnail"
                        fit="crop"
                        crop="entropy"
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
  import { format } from 'date-fns'
  import latestPublicationsQuery from '~/sanity/latestPublications.sanity'
  import { AUTHOR } from '~/assets/constants/types'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'
  import { usePosts } from '~/assets/composables/usePosts'
  import { convertTs } from '~/assets/utils/convert-timestamp'

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

  const { data: latestPublications, pending } = useLazySanityQuery(latestPublicationsQuery, { locale })
  posts.value = await getPosts(0, 4)
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

  &__link,
  &__sub-title {
    @include titleLink();
  }

  &__container {
    &--top,
    &--other {
      display: flex;
    }

    &--news {
      width: calc(67% - 10px);
    }

    &--card {
      width: calc(33% - 10px);
    }

    &--news,
    &--card {
      margin: 10px;
    }
  }

  &__thumbnail {
    @include thumbnail();
  }

  &__more {
    padding-left: var(--list-group--padding-left, var(--padding-left));
  }

  @include breakpoint-down('md') {
    &__container {
      &--top,
      &--other {
        flex-direction: column;
      }

      &--news,
      &--card {
        width: 100%;
      }
    }
  }
}
</style>