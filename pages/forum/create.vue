<template>
  <div class="sf-create-page">
    <h1
      class="sf-create-page__title"
      v-text="$t('forum.create.title')"
    />
    <PostEditor
      @error="onError"
      @success="onSuccess"
    />
    <IToastContainer />
  </div>
</template>
<script setup>
  import { useToast } from '@inkline/inkline'
  import PostEditor from '~/components/PostEditor.vue'

  const { t } = useI18n()
  const router = useRouter()
  const localePath = useLocalePath()
  const toast = useToast()

  const onError = () => toast.show({
    title: t('forum.create.toast.error.title'),
    message: t('forum.create.toast.error.message'),
    color: 'danger'
  })

  const onSuccess = (payload) => {
    toast.show({
      title: t('forum.create.toast.success.title'),
      message: t('forum.create.toast.success.message', { title: payload.title }),
      color: 'success'
    })

    useTimeoutFn(() => {
      router.replace(localePath('/forum'))
    }, 1000)
  }

  umTrackView()
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.sf-create-page {
  &__title {
    @include title();
  }
}
</style>