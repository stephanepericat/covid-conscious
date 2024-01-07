<template>
  <div class="article-page" :class="{ pending }">
    <ILoader v-if="pending" class="article-page__loader" />
    <template v-else-if="!pending && article">
      <h1 class="article-page__title">
        <span>{{ article.title }}</span>
        <div v-if="type === PRODUCT && ratingsAverage" class="article-page__title--info">
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

      <IMedia class="article-page__author">
        <template #image>
          <SanityImage
            v-if="article.author.avatar"
            :asset-id="article.author.avatar"
            fit="crop"
            crop="entropy"
            :h="50"
            :w="50"
          />
          <div v-else class="article-page__author--placeholder">
            <Icon
              class="article-page__author--placeholder-icon"
              name="material-symbols:account-circle-full"
            />
          </div>
        </template>
        <h5 class="article-page__author--name">
          <NuxtLink :to="localePath(`/${AUTHOR}/${article.author.slug}`)">{{ article.author.nickname }}</NuxtLink>
        </h5>
        <p class="article-page__info">
          <span class="article-page__info--category">{{ articleType }} / {{ article.category }} / {{ format(new Date(article.published), DEFAULT_DATE_FORMAT) }} ({{ $t("article.updated") }}: {{ format(new Date(article.updated), DEFAULT_DATE_FORMAT) }})</span>
        </p>
      </IMedia>

      <section class="article-page__body">
        <!-- video content -->
        <template v-if="type === VIDEO" class="article-page__body--video">
          <p class="article-page__body--video-summary">{{ article.summary }}</p>
          <div
            v-if="article.embedCode"
            v-html="article.embedCode"
            class="article-page__body--video-player"
          />
        </template>

        <SanityContent v-else :blocks="article.body" :serializers="serializers" />

        <!-- social media sharing -->
        <ShareButtons
          :title="article.title"
          :url="url.href"
          :hashtag="hashtag"
        />

        <!-- community content -->
        <template v-if="type === COMMUNITY && article.info">
          <h4 class="article-page__body--info" v-text="$t('article.contactInfo')" />
          <div class="article-page__body--info-address">
            <div v-text="article.info.street1" />
            <div v-text="article.info.street2" />
            <div v-text="article.info.city" />
            <div v-text="article.info.zipCode" />
            <div v-text="article.info.country" />
          </div>
          <div class="article-page__body--info-contact">
            <IButton v-if="article.info.phone" class="article-page__body--info-contact-button" :to="`tel:${article.info.phone}`">
              <Icon class="article-page__body--info-contact-icon" name="material-symbols:add-call-rounded" />
              {{ $t("article.call") }}
            </IButton>
            <IButton v-if="article.info.email" class="article-page__body--info-contact-button" :to="`mailto:${article.info.email}`">
              <Icon class="article-page__body--info-contact-icon" name="material-symbols:alternate-email-rounded" />
              {{ $t("article.email") }}
            </IButton>
            <IButton v-if="article.info.website" class="article-page__body--info-contact-button" :to="article.info.website" target="_blank">
              <Icon class="article-page__body--info-contact-icon" name="material-symbols:web-sharp" />
              {{ $t("article.website") }}
            </IButton>
          </div>
        </template>
        <!-- product content -->
        <template v-if="type === PRODUCT">
          <div class="article-page__body--info-product">
            <IButton v-if="article.link" class="article-page__body--info-product-button" :to="article.link" target="_blank">
              <Icon class="article-page__body--info-product-icon" name="material-symbols:info-outline-rounded" />
              {{ $t("article.moreInfo") }}
            </IButton>
          </div>
          <div class="article-page__reviews" v-if="articleId">
            <h3 v-text="$t('reviews.add')" class="article-page__reviews--title" />
            <div class="article-page__reviews--reviewed" v-if="hasUserReviewed">
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
              :pending="reviewsPending"
              :page="activePage"
              :reviews="reviews"
              :total-items="totalReviews"
              @page-change="onReviewsPageChange"
            />
          </div>
        </template>
      </section>
    </template>
    <IToastContainer />
  </div>
</template>
<script setup>
  import { format } from 'date-fns'
  import { useToast } from '@inkline/inkline'
  import { AUTHOR, COMMUNITY, PRODUCT, VIDEO } from '~/assets/constants/types'
  import publicationQuery from '~/sanity/publication.sanity'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'
  import ReviewBox from '~/components/ReviewBox.vue'
  import ReviewList from '~/components/ReviewList.vue'
  import { useReviews } from '~/assets/composables/useReviews'
  import ShareButtons from '~/components/ShareButtons.vue'
  import { serializers } from '~/assets/constants/serializers'

  const { locale, t } = useI18n()
  const localePath = useLocalePath()
  const { params } = useRoute()
  const { type, category, slug } = params
  const user = useSupabaseUser()
  const url = useRequestURL()
  const hashtag = computed(() => category.replace(/-/gi, ''))

  const { data: article, pending } = useLazySanityQuery(publicationQuery, {
    category,
    locale,
    slug,
    type,
  })

  const articleId = computed(() => article?.value?.id || null)

  const pageTitle = computed(() => t('article.title', { title: article?.value?.title || '' }))
  const articleType = computed(() => t(`layout.${type}`))

  useHead({
    meta: [
      { name: 'description', content: t('home.description') },
    ],
    title: pageTitle.value
  })

  // PRODUCT REVIEWS
  const { checkUserReview, getRatingsAverage, getReviews, getReviewsCount, getUserReview, reviewsLoading } = useReviews()
  const totalReviews = ref(0)
  const reviews = ref([])
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

  watch(articleId, async () => {
    if(!articleId.value || type !== PRODUCT) return

    activePage.value = 1
    reviews.value = await getReviews(articleId.value)
    totalReviews.value = await getReviewsCount(articleId.value)
    ratingsAverage.value = await getRatingsAverage(articleId.value)
    hasUserReviewed.value = await checkUserReview(articleId.value, user?.value?.id || null)
  }, { immediate: true })
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
    @include title();
    margin-bottom: 40px;

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

    &--name {
      margin: 0;
    }

    &--placeholder {
      height: 50px;
      margin-right: var(--media--image--margin-right, var(--margin-right));
      width: 50px;

      &-icon  {
        height: 48px;
        opacity: .5;
        width: 48px;
      }
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

    &--info {
      @include eyebrow();

      font-weight: 400;
      margin-top: 40px;

      &-address {
        font-size: 1.1rem;
      }

      &-contact,
      &-product {
        margin-top: 20px;

        &-button {
          margin-right: 10px;
        }

        &-icon {
          margin-right: 5px;
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
        margin-bottom: 40px;
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
}
</style>
<style>
.article-page__body--video-player iframe {
  height: 100% !important;
  width: 100% !important;
}
</style>