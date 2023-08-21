<template>
  <div class="sf-login-page">
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
  // import { useI18n } from '#imports'

  import Auth from '../components/UserAuth.vue'

  const { t } = useI18n()
  const toast = useToast()

  const onSuccess = () => {
    toast.show({
      title: t('supabase-forum.auth.toast.success.title'),
      message: t('supabase-forum.auth.toast.success.message'),
      color: 'success'
    })
  }
  const onError = () => {
    toast.show({
      title: t('supabase-forum.auth.toast.error.title'),
      message: t('supabase-forum.auth.toast.error.message'),
      color: 'danger'
    })
  }
</script>
<style lang="scss" scoped>
.sf-login-page {
  &__auth {
    width: 50vh;
    margin: 40px auto;
  }
}
</style>