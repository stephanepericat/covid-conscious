<template>
  <div class="create-account-page">
    <h1 class="create-account-page__title">{{ t('layout.user.signUp') }}</h1>
    <Signup
      class="create-account-page__auth"
      @error="onError"
      @success="onSuccess"
    />
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
  &__title {
    @include title();

    margin: 0 auto;
    width: 300px;
  }

  &__auth {
    width: 300px;
    margin: 40px auto;
  }
}
</style>