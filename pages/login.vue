<template>
  <div class="sf-login-page">
    <h1 class="sf-login-page__title">{{ t('layout.user.signIn') }}</h1>
    <Auth
      class="sf-login-page__auth"
      @error="onError"
      @success="onSuccess"
    />
    <IToastContainer />
  </div>
</template>
<script setup>
  import { useToast } from '@inkline/inkline'

  import Auth from '../components/UserAuth.vue'

  const { t } = useI18n()
  const toast = useToast()

  const onSuccess = () => {
    toast.show({
      title: t('forum.auth.toast.success.title'),
      message: t('forum.auth.toast.success.message'),
      color: 'success'
    })
  }
  const onError = () => {
    toast.show({
      title: t('forum.auth.toast.error.title'),
      message: t('forum.auth.toast.error.message'),
      color: 'danger'
    })
  }

  umTrackView()
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";
.sf-login-page {
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