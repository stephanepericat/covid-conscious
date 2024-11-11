<template>
  <IForm class="sf-comment-box" @submit.prevent="onSubmit">
    <h3 class="sf-comment-box__title" v-text="$t('forum.comments.box.title')" />

    <p v-if="!loggedIn" v-text="$t('forum.comments.box.loggedIn')" />

    <PostDisabled v-else-if="loggedIn && !canComment" type="comment" />

    <template v-else>
      <IFormGroup>
        <ITextarea v-model="comment" :disabled="loading" :placeholder="$t('forum.comments.box.placeholder')" />
      </IFormGroup>
      <IFormGroup>
        <IButton :disabled="buttonDisabled || loading" type="submit">
          <Icon
            v-if="loading"
            name="eos-icons:loading"
          />
          {{ $t('forum.comments.box.button') }}
        </IButton>
      </IFormGroup>
    </template>
  </IForm>
</template>
<script setup>
  // import { usePosts } from '~/assets/composables/usePosts'
  import PostDisabled from './PostDisabled.vue'
  import { usePrisma } from '~/assets/composables/usePrisma'

  const emit = defineEmits(['success', 'error'])

  const props = defineProps({
    postId: { type: Number, required: true },
  })

  const { postId } = toRefs(props)

  // const user = useSupabaseUser()
  const { createComment, getUser } = usePrisma()
  const { user } = useUserSession()
  const userInfo = computedAsync(
    async () =>
      user?.value?.email ? await getUser(user.value.email) : null,
    null,
  )
  const username = computed(() => userInfo.value?.profile.name || null)
  const loggedIn = computed(() => !!user.value)
  const canComment = computed(() => username !== null)

  // const { createComment, getUserById } = usePosts()

  // const userInfo = await getUserById(user?.value?.id || null);
  // const canComment = computed(() => userInfo && userInfo.username !== null)

  const comment = ref('')
  const buttonDisabled = computed(() => !comment.value.length)
  const loading = ref(false)

  const onSubmit = async () => {
    const payload = {
      authorId: userInfo.value.id,
      content: comment.value,
    }

    loading.value = true

    try {
      const { data, error } = await createComment(postId.value, payload)
      if(error) throw error
      emit('success', data)
    } catch(e) {
      console.error(e)
      emit('error')
    } finally {
      comment.value = ''
      loading.value = false
    }
  }
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.sf-comment-box {
  &__title {
    @include titleLink();
  }
}
</style>