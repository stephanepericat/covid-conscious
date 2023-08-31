<template>
  <div class="sf-create-page">
    <h1
      class="sf-create-page__title"
      v-text="$t('supabase-forum.create.title')"
    />
    <PostEditor
      @error="onError"
      @success="onSuccess"
    />
  </div>
</template>
<script setup>
  import { useToast } from '@inkline/inkline'
  import PostEditor from '~/components/PostEditor.vue'

  const { t } = useI18n()
  const toast = useToast()

  const onError = () => toast.show({
    title: t('supabase-forum.create.toast.error.title'),
    message: t('supabase-forum.create.toast.error.message'),
    color: 'danger'
  })

  const onSuccess = (payload) => toast.show({
    title: t('supabase-forum.create.toast.success.title'),
    message: t('supabase-forum.create.toast.success.message', { title: payload.headline }),
    color: 'success'
  })
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.sf-create-page {
  &__title {
    @include title();
  }
}
</style>