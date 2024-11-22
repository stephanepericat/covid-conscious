<template>
  <div class="review-box">
    <div class="review-box__form" v-if="canReview">
      <ITextarea
        v-model="reviewContent"
        :placeholder="$t('reviews.placeholder')"
        required
        :disabled="submitting"
      />
      <ClientOnly>
        <p class="review-box__rate" v-text="$t('reviews.rate')" />
        <StarRating
          :show-rating="false"
          :star-size="20"
          v-model:rating="reviewRating"
        />
      </ClientOnly>
      <IButton
        class="review-box__submit"
        :disabled="!canSubmit || submitting"
        @click="onSubmit"
      >
        {{ buttonLabel }}
      </IButton>
    </div>
    <p v-else class="review-box__anonymous">
      <span v-text="$t('reviews.notLoggedIn')" />&nbsp;
      <NuxtLink :to="localePath('/login')">{{ $t('reviews.signIn') }}</NuxtLink>
    </p>
  </div>
</template>
<script setup>
  // import { usePosts } from '~/assets/composables/usePosts'
  import { usePrisma } from '~/assets/composables/usePrisma';
  import { useReviews } from '~/assets/composables/useReviews'

  const props = defineProps({
    articleId: { type: String, default: null },
    canReview: Boolean,
    update: Boolean,
    userId: { type: Number, default: null },
    userName: { type: String, default: null },
    userReview: { type: Object, default: () => ({})},
  })

  const emit = defineEmits(['error', 'success'])

  const { articleId, update, userId, userName, userReview } = toRefs(props)

  const { t } = useI18n()
  const localePath = useLocalePath()
  // const user = useSupabaseUser()
  // const { user } = useUserSession()
  // const { getUserById } = usePosts()
  // const { getUsername } = usePrisma()
  // const { createReview, updateReview } = useReviews()

  // const userInfo = await getUserById(user?.value?.id || null)
  // const canReview = computed(() => userInfo && userInfo.username !== null)
  // const username = computedAsync(
  //   async () =>
  //     user?.value?.email ? await getUsername(user.value.email) : null,
  //   null,
  // )
  const canReview = computed(() => userName.value !== null)

  const reviewContent = ref(update.value ? userReview.value.content : '')
  const reviewRating = ref(update.value ? userReview.value.rating : 0)

  const clearForm = () => {
    reviewContent.value = ''
    reviewRating.value = 0
  }

  const canSubmit = computed(() => articleId.value && canReview.value && reviewContent.value && reviewRating.value)

  const submitting = ref(false)

  const buttonLabel = ref(update.value ? t('reviews.update') : t('reviews.submit'))

  const onSubmit = async () => {
    const payload = {
      content: reviewContent.value,
      rating: reviewRating.value,
      authorId: userId.value,
      productId: articleId.value,
    }

    console.log('payload', payload)

    // submitting.value = true

    // try {
    //   // const { data, error } = update.value
    //   //   ? await updateReview({ ...payload, updated_at: new Date() }, userReview.value.id)
    //   //   : await createReview(payload)

    //   if(error) throw error

    //   if(data?.id) {
    //     emit('success', { updated: update.value })
    //   }
    // } catch(e) {
    //   console.error(e)
    //   emit('error')
    // } finally {
    //   if(!update.value) clearForm()
    //   submitting.value = false
    // }
  }
</script>
<style lang="scss" scoped>
.review-box {
  &__anonymous {
    font-size: 16px;
  }

  &__rate {
    font-size: 16px;
    font-weight: 500;
    margin: 15px 0 0 0;
  }

  &__submit {
    margin-top: 20px;
  }
}
</style>