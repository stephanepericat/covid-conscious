<template>
  <div class="reset-password-page">
    <h1 class="reset-password-page__title">{{ t('layout.user.resetPassword') }}</h1>
    <ResetPassword
      class="reset-password-page__auth"
      @error="onError"
      @success="onSuccess"
    />
  </div>
</template>
<script setup>
  import { useToast } from '@inkline/inkline'

  import ResetPassword from '~/components/UserResetRequest.vue'

  const { t } = useI18n()
  const toast = useToast()

  const onSuccess = () => {
    toast.show({
      title: t('login.toast.reset.title'),
      message: t('login.toast.reset.message'),
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
.reset-password-page {
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