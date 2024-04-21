<template>
  <div class="update-password-page">
    <h1 class="update-password-page__title">{{ t('layout.user.updatePassword') }}</h1>
    <UpdatePassword
      class="update-password-page__auth"
      @error="onError"
      @success="onSuccess"
    />
  </div>
</template>
<script setup>
  import { useToast } from '@inkline/inkline'
  import UpdatePassword from '~/components/UserPasswordUpdate.vue'

  const { t } = useI18n()
  const toast = useToast()
  const router = useRouter()
  const localePath = useLocalePath()

  const onSuccess = () => {
    toast.show({
      title: t('login.toast.update.title'),
      message: t('login.toast.update.message'),
      color: 'success'
    })

    router.push(localePath('/account'))
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
.update-password-page {
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