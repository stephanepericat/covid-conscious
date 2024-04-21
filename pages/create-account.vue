<template>
  <div class="create-account-page">
    <h1 class="create-account-page__title">{{ t('layout.user.signUp') }}</h1>
    <Signup
      class="create-account-page__auth"
      @error="onError"
      @success="onSuccess"
    />
    <div class="create-account-page__actions">
      <NuxtLink class="create-account-page__actions--link" :to="localePath('/login')">{{ t('layout.user.signIn') }}</NuxtLink>
    </div>
  </div>
</template>
<script setup>
  import { useToast } from '@inkline/inkline'

  import Signup from '~/components/UserSignup.vue'

  const { t } = useI18n()
  const toast = useToast()

  const onSuccess = () => {
    toast.show({
      title: t('login.toast.signup.title'),
      message: t('login.toast.signup.message'),
      color: 'success'
    })
  }
  const onError = () => {
    toast.show({
      title: t('login.toast.error.title'),
      message: t('login.toast.error.message'),
      color: 'danger'
    })
  }

  umTrackView()
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";
.create-account-page {
  margin: 0 auto;
  width: 300px;

  &__title {
    @include title();
  }

  &__auth {
    margin: 40px 0;
  }

  &__actions {
    align-items: center;
    display: flex;
    flex-direction: column;

    &--link {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: .1rem;
      margin: 5px 0;
      text-transform: uppercase;
    }
  }
}
</style>