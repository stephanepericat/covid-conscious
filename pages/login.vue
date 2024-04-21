<template>
  <div class="login-page">
    <h1 class="login-page__title">{{ t('layout.user.signIn') }}</h1>
    <Auth
      class="login-page__auth"
      @error="onError"
      @success="onLoginSuccess"
    />
    <div class="login-page__actions">
      <NuxtLink class="login-page__actions--link" :to="localePath('/create-account')">{{ t('layout.user.createAccount') }}</NuxtLink>
      <NuxtLink class="login-page__actions--link" :to="localePath('/reset-password')">{{ t('layout.user.resetPassword') }}</NuxtLink>
    </div>
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