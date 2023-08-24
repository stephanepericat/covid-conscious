<template>
  <div class="review-box">
    <h3 v-text="$t('reviews.add')" class="review-box__title" />
    <div class="review-box__form" v-if="canReview">
      <ITextarea v-model="reviewContent" :placeholder="$t('reviews.placeholder')" required />
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
        :disabled="!canSubmit"
        @click="onSubmit"
      >
        {{ $t('reviews.submit') }}
      </IButton>
    </div>
    <p v-else class="review-box__anonymous">
      <span v-text="$t('reviews.notLoggedIn')" />&nbsp;
      <NuxtLink :to="localePath('/login')">{{ $t('reviews.signIn') }}</NuxtLink>
    </p>
  </div>
</template>
<script setup>
  import { usePosts } from '~/assets/composables/usePosts'

  const localePath = useLocalePath()
  const user = useSupabaseUser()
  const { getUserById } = usePosts()

  const userInfo = await getUserById(user?.value?.id || null)
  const canReview = computed(() => userInfo && userInfo.username !== null)

  const reviewContent = ref('')
  const reviewRating = ref(0)

  const canSubmit = computed(() => canReview.value && reviewContent.value && reviewRating.value)

  const onSubmit = () => console.log('submit review', { body: reviewContent.value, rating: reviewRating.value })
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

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

  &__title {
    @include titleLink();
  }
}
</style>