<template>
  <div class="login-page">
    <h1 class="login-page__title">{{ t('layout.user.signIn') }}</h1>
    <Auth
      class="login-page__auth"
      @error="onError"
      @success="onLoginSuccess"
    />
    <IToastContainer />
  </div>
</template>
<script setup>
  import { useToast } from '@inkline/inkline'
  import Auth from '../components/UserAuth.vue'

  const { t } = useI18n()
  const toast = useToast()
  const router = useRouter()
  const localePath = useLocalePath()

  const onError = () => {
    toast.show({
      title: t('login.toast.error.title'),
      message: t('login.toast.error.message'),
      color: 'danger'
    })
  }

  const onLoginSuccess = () => {
    router.push(localePath('/account'))
  }

  umTrackView()
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";
.login-page {
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