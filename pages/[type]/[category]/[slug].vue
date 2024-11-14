<template>
  <div class="article-page" :class="{ pending }">

    <!-- HEAD METADATA AND TITLE -->
    <Head>
      <Title>{{ pageTitle }}</Title>
      <Meta name="description" :content="pageDescription" />
      <Meta name="og:title" :content="pageTitle" />
      <Meta name="og:description" :content="pageDescription" />
      <Meta name="og:image" :content="ogImage" />
      <Meta name="og:image:secure_url" :content="ogImage" />
      <Meta name="og:image:type" :content="ogImageType" />
      <Meta name="og:image:alt" :content="pageTitle" />
      <Meta name="og:locale" :content="locale" />
      <Meta name="og:site_name" :content="$t('layout.tcl')" />
      <Meta name="twitter:title" :content="pageTitle" />
      <Meta name="twitter:description" :content="pageDescription" />
      <Meta name="twitter:image" :content="ogImage" />
      <Meta name="twitter:site" content="@thatcovidlife" />
      <Meta name="twitter:card" content="summary_large_image" />
    </Head>

    <ILoader v-if="pending" class="article-page__loader" />

    <template v-else-if="!pending && article">
      <h1 class="article-page__title" :class="{ 'with-brand': brand?.name}">
        <span>{{ isBrand(type) ? article.name : article.title }}</span>
        <div v-if="isProduct(type) && ratingsAverage" class="article-page__title--info">
          <StarRating
            :increment="0.01"
            :rating="parseFloat(ratingsAverage)"
            read-only
            :show-rating="false"
            :star-size="30"
          />
          <em class="article-page__title--average">({{ $t('reviews.average') }}: {{ ratingsAverage }})</em>
        </div>
      </h1>
      <h2 v-if="brand?.name" class="text-lg font-bold uppercase tracking-widest mb-8">
        <NuxtLink :to="localePath(brand.path)">{{ brand.name }}</NuxtLink>
      </h2>

      <!-- <IMedia class="article-page__author" v-if="article.author">
        <template #image>
          <SanityImage
            v-if="article.author.avatar"
            class="article-page__author--avatar"
            :asset-id="article.author.avatar"
            fit="crop"
            crop="entropy"
            :h="50"
            :w="50"
          />
          <img v-else class="article-page__author--placeholder" src="/tcl-logo-big-grey.jpeg" />
        </template>
        <h5 class="article-page__author--name">
          <NuxtLink :to="localePath(`/${AUTHOR}/${article.author.slug}`)">{{ article.author.nickname }}</NuxtLink>
        </h5>
        <p class="article-page__info">
          <span class="article-page__info--category">{{ articleType }} / {{ article.category }} / {{ format(new Date(article.published), DEFAULT_DATE_FORMAT) }} ({{ $t("article.updated") }}: {{ format(new Date(article.updated), DEFAULT_DATE_FORMAT) }})</span>
        </p>
        <div v-if="article.tags" class="article-page__tags">
          <IBadge
            v-for="{ name, uri } in article.tags"
            :key="uri"
            class="article-page__tags--item"
            @click="onTagClick({ uri })"
          >
            {{ name }}
          </IBadge>
        </div>
      </IMedia> -->

      <IMedia class="article-page__author">
        <template #image>
          <SanityImage
            v-if="article.thumbnail"
            class="article-page__author--avatar"
            :asset-id="article.thumbnail"
            fit="crop"
            crop="entropy"
            :h="50"
            :w="50"
          />
          <img v-else class="article-page__author--placeholder" src="/tcl-logo-big-grey.jpeg" />
        </template>
        <p class="article-page__info no-author">
          <span class="article-page__info--category">
            <NuxtLink :to="localePath(`/${type}`)">{{ articleType }}</NuxtLink>
            <span v-if="showPublicationDate(type)"> / {{ format(new Date(article.date ? convertTs(article.date) : article.published), LOCALIZED_DATE_FORMAT, { locale: getDateLocale(locale)}) }}</span>
            <span v-if="article.end"> - {{ format(new Date(convertTs(article.end)), LOCALIZED_DATE_FORMAT, { locale: getDateLocale(locale)}) }}</span>
          </span>
        </p>
        <div v-if="article.tags" class="article-page__tags">
          <IBadge
            v-for="{ name, uri } in article.tags"
            :key="uri"
            class="article-page__tags--item"
            @click="onTagClick({ uri })"
          >
            {{ name }}
          </IBadge>
        </div>
      </IMedia>

      <section class="article-page__body">
        <PromoZone
          class="mb-8"
          :height="300"
          :zone-id="ART_ZONE_1"
          :zones="article?.promos"
        />
        <!-- video content -->
        <template v-if="isVideo(type)" class="article-page__body--video">
          <p class="article-page__body--video-summary">
            <SanityContent :blocks="article.body" :serializers="serializers" />
          </p>
          <div
            v-if="article.embedCode"
            v-html="article.embedCode"
            class="article-page__body--video-player"
          />
          <IButton v-else :href="article.link" target="_blank">
            <template #icon>
              <Icon name="material-symbols:auto-videocam-outline-rounded" />
            </template>
            {{ $t('article.watchVideo') }}
          </IButton>
        </template>

        <template v-else-if="isEvent(type) || isResource(type)">
          <p class="article-page__body--summary">
            <SanityContent :blocks="article.body" :serializers="serializers" />
          </p>
          <IButton :href="article.link" target="_blank">
            <template #icon>
              <Icon name="material-symbols:info-outline-rounded" />
            </template>
            {{ isEvent(type) ? $t('article.moreInfo') : $t('article.readMore') }}
          </IButton>
        </template>

        <section v-else class="article-page__body--contents">
          <div class="article-page__body--contents-text">
            <SanityContent :blocks="article.body" :serializers="serializers" />
            <!-- library -->
            <IButton v-if="isLibrary(type)" :href="article.link" target="_blank" class="mt-4">
              <template #icon>
                <Icon name="material-symbols:info-outline-rounded" />
              </template>
              {{ $t('article.readMore') }}
            </IButton>
            <!-- directory map -->
            <div v-if="isDirectory(type) && article.location" class="article-page__body--contents-map">
              <ClientOnly>
                <LMap
                  :zoom="zoom"
                  :center="[article.location.lat, article.location.lng]"
                >
                  <LMarker
                    :latLng="[article.location.lat, article.location.lng]"
                  />
                  <LTileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                    layer-type="base"
                    name="OpenStreetMap"
                  />
                </LMap>
              </ClientOnly>
            </div>
            <!-- covidnet content -->
             <div v-if="isCovidnet(type)">
                <IButton
                  v-if="article.covidnet.contentType === covidnetTypes.BLOG && article.covidnet.blogURL"
                  :to="article.covidnet.blogURL"
                  target="_blank"
                >
                  <template #icon>
                    <Icon
                      name="gg:website"
                    />
                  </template>
                  {{ $t('covidnet.blog.link') }}
                </IButton>
                <IButton
                  v-if="article.covidnet.contentType === covidnetTypes.TWITTER"
                  :to="`https://x.com/${article.covidnet.twitterUsername}`"
                  target="_blank"
                >
                  <template #icon>
                    <Icon
                      name="logos:twitter"
                    />
                  </template>
                  {{ $t('covidnet.twitter.link') }}
                </IButton>
                <div v-if="hasFeaturedContent(article.covidnet)" class="grid">
                  <ILoader v-if="isFeaturedContentLoading" class="article-page__loader" size="sm" />
                  <FeaturedPosts
                    v-if="!isFeaturedContentLoading && featuredPosts.length > 0"
                    class="mt-8"
                    :content-type="article.covidnet.contentType"
                    :posts="featuredPosts"
                    :title="$t('covidnet.blog.featured')"
                  />
                </div>
                <template v-if="article.covidnet.contentType === covidnetTypes.YOUTUBE">
                  <IButton :to="article.covidnet.channelURL" target="_blank">
                    <template #icon>
                      <Icon name="logos:youtube-icon" />
                    </template>
                    {{ $t('covidnet.videos.channel') }}
                  </IButton>
                  <ChannelVideos
                    v-if="channelVideos.length > 0"
                    class="mt-8"
                    :title="$t('covidnet.videos.latest')"
                    :videos="channelVideos"
                  />
                </template>
             </div>
          </div>
          <!-- community content -->
          <div v-if="isDirectory(type) && article.info" class="article-page__body--contents-info">
            <h4 class="article-page__body--info" v-text="$t('article.contactInfo')" />
            <div class="article-page__body--info-address">
              <div v-text="article.title" />
              <div v-text="article.info.street1" />
              <div v-text="article.info.street2" />
              <div v-text="article.info.city" />
              <div v-text="article.info.zipCode" />
              <div v-text="article.info.country" />
              <div v-if="article.onlineOnly">
                <IBadge
                  class="uppercase tracking-widest mb-0"
                  color="secondary"
                >
                  <Icon
                    class="icon"
                    name="oui:online"
                  />{{ $t('article.online') }}
                </IBadge>
              </div>
              <br/>
              <div v-if="article.info.phone" class="article-page__body--info-contact-row">
                <Icon class="article-page__body--info-contact-icon" name="material-symbols:add-call-rounded" />
                <a :href="`tel:${article.info.phone}`">{{ article.info.phone }}</a>
              </div>
              <div v-if="article.info.email" class="article-page__body--info-contact-row">
                <Icon class="article-page__body--info-contact-icon" name="material-symbols:alternate-email-rounded" />
                <a :href="`mailto:${article.info.email}`">{{ article.info.email }}</a>
              </div>
              <div v-if="article.info.website" class="article-page__body--info-contact-row">
                <Icon class="article-page__body--info-contact-icon" name="material-symbols:web-sharp" />
                <a :href="article.info.website" target="_blank">{{ article.info.website }}</a>
              </div>
            </div>
          </div>
        </section>
        
        <!-- related articles -->
        <RelatedArticles
          v-if="relatedArticles.length"
          class="mt-8 mb-4"
          :articles="relatedArticles"
          :title="$t('article.related')"
        />

        <!-- social media sharing -->
        <ShareButtons
          class="article-page__share"
          :title="article.title"
          :url="url.href"
          :hashtag="hashtag"
        />

        <!-- brand content -->
        <template v-if="isBrand(type)">
          <div class="article-page__body--info-product">
            <IButton v-if="article.link" class="article-page__body--info-product-button" :to="article.link" target="_blank">
              <Icon class="article-page__body--info-product-icon" name="gg:website" />
              {{ $t("article.manufacturerWebsite") }}
            </IButton>
          </div>
          <ListedProducts
            v-if="listedProducts"
            class="mt-8"
            :products="listedProducts"
            :title="$t('article.listedProducts')"
          />
        </template>

        <!-- product content -->
        <template v-if="isProduct(type)">
          <div class="article-page__body--info-product">
            <IButton v-if="article.link" class="article-page__body--info-product-button" :to="article.link" target="_blank">
              <Icon class="article-page__body--info-product-icon" name="material-symbols:info-outline-rounded" />
              {{ $t("article.moreInfo") }}
            </IButton>
            <IButton v-if="brand?.url" class="article-page__body--info-product-button brand" :to="brand.url" target="_blank">
              <Icon class="article-page__body--info-product-icon" name="gg:website" />
              {{ $t("article.manufacturerWebsite") }}
            </IButton>
          </div>
          <div class="article-page__reviews" v-if="articleId">
            <h3 v-text="$t('reviews.add')" class="article-page__reviews--title" />
            <div class="article-page__reviews--reviewed" v-if="user?.value && hasUserReviewed">
              <p>
                <span v-text="$t('reviews.edit.already')" /> <a v-if="articleId" href="#" @click="onShowReviewEditor" v-text="$t('reviews.edit.click')" />
              </p>
              <ReviewBox
                v-if="showReviewEditor"
                class="article-page__reviews--box"
                :article-id="articleId"
                update
                :user-review="userReview"
                @error="onReviewPostError"
                @success="onReviewPostSuccess"
              />
            </div>
            <ReviewBox
              v-else
              class="article-page__reviews--box"
              :article-id="articleId"
              @error="onReviewPostError"
              @success="onReviewPostSuccess"
            />
            <h2 class="article-page__reviews--title">
              <Icon name="material-symbols:rate-review-outline-rounded" />
              <span v-text="$t('reviews.title')" />
            </h2>
            <ReviewList
              v-if="!reviewsPending"
              :pending="reviewsPending"
              :page="activePage"
              :reviews="reviews.entries"
              :total-items="totalReviews"
              @page-change="onReviewsPageChange"
            />
          </div>
        </template>
      </section>
      <PromoZone
        class="mt-12"
        :height="300"
        :zone-id="ART_ZONE_2"
        :zones="article?.promos"
      />
    </template>
    <IToastContainer />
  </div>
</template>
<script setup>
  import { format } from 'date-fns'
  import { useToast } from '@inkline/inkline'
  // import { AUTHOR } from '~/assets/constants/types'
  import { isBrand, isCovidnet, isDirectory, isEvent, isLibrary, isProduct, isResource, isVideo, showPublicationDate } from '~/assets/utils/article-types'
  import publicationQuery from '~/sanity/publication.sanity'
  import { LOCALIZED_DATE_FORMAT } from '~/assets/constants/date-formats'
  import ReviewBox from '~/components/ReviewBox.vue'
  import ReviewList from '~/components/ReviewList.vue'
  import { useReviews } from '~/assets/composables/useReviews'
  import ShareButtons from '~/components/ShareButtons.vue'
  import { serializers } from '~/assets/constants/serializers'
  import { useCovidnet } from '~/assets/composables/useCovidnet'
  import { useTags } from '~/assets/composables/useTags'
  import { convertTs } from '~/assets/utils/convert-timestamp'
  import { getDateLocale } from '~/assets/constants/date-locales'
  import PromoZone from '~/components/PromoZone.vue'
  import { 
    ART_ZONE_1,
    ART_ZONE_2,
  } from '~/assets/constants/promo-zones'
  import RelatedArticles from '~/components/RelatedArticles.vue'
  import ChannelVideos from '~/components/ChannelVideos.vue'
  import FeaturedPosts from '~/components/FeaturedPosts.vue'
  import ListedProducts from '~/components/ListedProducts.vue'
  import { usePrisma } from '~/assets/composables/usePrisma'

  const { locale, t } = useI18n()
  const localePath = useLocalePath()
  const { params } = useRoute()
  const { type, category, slug } = params
  const user = useSupabaseUser()
  const url = useRequestURL()
  const { onTagClick } = useTags()
  const hashtag = computed(() => category.replace(/-/gi, ''))

  const { data: article, pending } = useLazySanityQuery(publicationQuery, {
    category,
    locale,
    slug,
    type,
  })

  const articleId = computed(() => article?.value?.id || null)
  const relatedArticles = computed(() => article?.value?.related.sort(() => Math.random() - 0.5).slice(0, 3) || [])

  const pageTitle = computed(() => article?.value?.title || article?.value?.name || '')
  const pageDescription = computed(() =>  article?.value?.description || t('home.description'))
  const ogImage = computed(() => article?.value?.image ? `${article.value.image}?crop=entropy&fit=crop&h=450&w=800` : '/tcl-fallback-169.jpg')
  const ogImageType = computed(() => {
    const extension = ogImage.value.split('.').pop().split('?').shift()
    return `image/${extension}`
  })
  const articleType = computed(() => t(`layout.${type}`))

  // COVIDNET
  const { covidnetTypes, getChannelFeed, getFeaturedContent, hasFeaturedContent, isFeaturedContentLoading } = useCovidnet()
  const channelFeed = await useAsyncData('channelFeed', () => {
    return isCovidnet(type) && article?.value?.covidnet?.channelID
      ? getChannelFeed(article.value.covidnet.channelID)
      : []
  }, { watch: [article]})
  const channelVideos = computed(() => channelFeed?.data?.value || [])
  const ftdPosts = await useAsyncData('ftdPosts', () => {
    return isCovidnet(type) && article?.value?.covidnet && hasFeaturedContent(article?.value?.covidnet)
      ? getFeaturedContent(article.value.covidnet)
      : []
  }, { watch: [article]})
  const featuredPosts = computed(() => ftdPosts?.data?.value || [])

  // PRODUCT BRAND
  const brand = computed(() => isProduct(type) && article?.value?.brand || false)
  const listedProducts = computed(() => isBrand(type) && article?.value?.products || false)

  // PRODUCT REVIEWS
  const { checkUserReview, getRatingsAverage, getReviews, getReviewsCount, getUserReview, reviewsLoading } = useReviews()
  const { getProductReviews } = usePrisma()
  // const totalReviews = ref(0)
  // const reviews = ref([])
  const reviews = ref({})
  const totalReviews = computed(() => reviews.value?.total || 0)
  const ratingsAverage = ref("")
  const activePage = ref(1)
  const hasUserReviewed = ref(true)
  const showReviewEditor = ref(false)
  const reviewsPending = computed(() => !articleId.value || reviewsLoading.value)
  const userReview = ref(null)

  const onReviewsPageChange = async ({ currentPage, startItem, endItem }) => {
    if(activePage.value !== currentPage) {
      activePage.value = currentPage
      reviews.value = await getReviews(articleId.value, startItem, endItem - 1)
      totalReviews.value = await getReviewsCount(articleId.value)
      ratingsAverage.value = await getRatingsAverage(articleId.value)
      hasUserReviewed.value = await checkUserReview(articleId.value, user?.value?.id || null)
    }
  }

  const toast = useToast()

  const onReviewPostSuccess = async ({ updated }) => {
    toast.show({
      title: t(`reviews.toast.${updated ? 'update' : 'success'}.title`),
      message: t(`reviews.toast.${updated ? 'update' : 'success'}.message`),
      color: 'success'
    })

    activePage.value = 1
    reviews.value = await getReviews(articleId.value)
    totalReviews.value = await getReviewsCount(articleId.value)
    ratingsAverage.value = await getRatingsAverage(articleId.value)
    hasUserReviewed.value = true
  }

  const onReviewPostError = () => toast.show({
    title: t('reviews.toast.error.title'),
    message: t('reviews.toast.error.message'),
    color: 'danger'
  })

  const onShowReviewEditor = async () => {
    userReview.value = await getUserReview(articleId.value, user.value.id)
    showReviewEditor.value = true
  }

  const zoom = ref(6)

  watch(articleId, async () => {
    if(!articleId.value || !isProduct(type)) return

    activePage.value = 1
    // reviews.value = await getReviews(articleId.value)
    // totalReviews.value = await getReviewsCount(articleId.value)
    // ratingsAverage.value = await getRatingsAverage(articleId.value)
    // hasUserReviewed.value = await checkUserReview(articleId.value, user?.value?.id || null)
    reviews.value = await getProductReviews(articleId.value)
  }, { immediate: true })

  umTrackView()
</script>
<style lang="scss" scoped>
@import "@inkline/inkline/css/mixins";
@import "~/assets/sass/mixins.scss";

.article-page {
  &.pending {
    @include pending();
  }

  &__loader {
    @include loader();
  }

  &__title {
    @include title();
    margin-bottom: 40px;

    &.with-brand {
      margin-bottom: 0px;
    }

    &--info {
      display: flex;
      height: 48px;
    }

    &--average {
      align-items: flex-end;
      display: flex;
      font-family: var(--body--font-family, var(--font-family-primary-base));
      font-size: 16px;
      margin-left: 5px;
      padding-bottom: 8px;
    }
  }

  &__info--category,
  &__author--name {
    @include eyebrow();

    font-weight: 500;
  }

  &__author {
    margin-bottom: 40px;

    &--avatar,
    &--placeholder {
      border-radius: 5px;
    }

    &--name {
      margin: 0;
    }

    &--placeholder {
      height: 50px;
      margin-right: var(--media--image--margin-right, var(--margin-right));
      width: 50px;
    }
  }

  &__info {
    &--category {
      font-size: 14px;
      font-weight: 300;
    }

    &.no-author {
      margin-top: -5px;
      margin-bottom: 5px;
    }
  }

  &__body {
    font-size: 1.25rem;
    font-weight: 300;

    :deep(strong) {
      font-weight: 500;
    }

    &--info {
      @include eyebrow();

      font-size: 20px;
      font-weight: 700;

      &-address {
        font-size: 1.1rem;
        margin-bottom: 30px;
      }

      &-contact,
      &-product {
        margin-top: 20px;

        &-button {
          margin-bottom: 15px;

          &.brand {
            margin-left: 12px;
          }
        }

        &-icon {
          margin-right: 5px;
        }

        &-row {
          display: flex;
          align-items: center;
        }

        @include breakpoint-down('sm') {
          &-button {
            width: 100%;
          }
        }
      }

      &-product {
        margin-top: 40px;
      }
    }

    &--video {
      &-player {
        aspect-ratio: 16 / 9;
      }

      &-summary {
        font-size: 18px;
        line-height: 28px;
        margin-bottom: 40px;
      }
    }

    &--summary {
      font-size: 18px;
      line-height: 28px;
      margin-bottom: 40px;
    }

    &--contents {
      display: flex;
      
      &-info {
        flex-basis: 350px;
        flex-shrink: 0;
        margin-left: 30px;
      }

      &-text {
        font-size: 18px;
        line-height: 28px;
      }

      &-map {
        aspect-ratio: 16 / 9;
        border-radius: .5rem;
        margin-top: 30px;
        overflow: hidden;
      }
    }

    @include breakpoint-down('md') {
      &--contents {
        flex-direction: column;

        &-info {
          flex-basis: 100%;
          margin-left: 0;
          margin-top: 20px;
        }
      }
    }
  }

  &__reviews {
    margin-top: 40px;

    &--box,
    &--reviewed {
      margin-bottom: 20px;
    }

    &--title {
      @include titleLink();

      span {
        margin-left: 5px;
      }
    }
  }

  &__tags {
    &--item {
      @include eyebrow();

      cursor: pointer;
      margin-right: 10px;
    }
  }

  @include breakpoint-down('md') {
    &__share {
      display: none;
    }
  }

  .icon {
    margin-right: 3px;
    vertical-align: top !important;
  }
}
</style>
<style>
.article-page__body--video-player iframe {
  height: 100% !important;
  width: 100% !important;
}
</style>