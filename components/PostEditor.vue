<template>
  <div class="sf-post-editor">
    <PostDisabled  v-if="!canPost" type="post" />
    <IForm
      v-else
      v-model="form"
      @submit="showConfirmation = true"
    >
      <IFormGroup required>
        <IFormLabel>{{ $t('forum.create.labels.title') }}</IFormLabel>
        <IInput
          name="title"
          :placeholder="$t('forum.create.placeholders.title')"
          :error="['invalid']"
          autofocus
        />
        <IFormError
          for="title"
          :visible="['invalid']"
        />
      </IFormGroup>
      <IFormGroup required>
        <IFormLabel>{{ $t('forum.create.labels.contents') }}</IFormLabel>
        <ClientOnly>
          <QuillEditor
            ref="editor"
            class="sf-post-editor__editor"
            name="contents"
            :placeholder="$t('forum.create.placeholders.contents')"
            theme="snow"
            toolbar="essential"
            @update:content="onContentsUpdate"
          />
          <IFormError
            for="contents"
            :visible="['invalid']"
          />
          <template #fallback>
            <div class="sf-post-editor__editor--fallback">
              <Icon
                class="sf-post-editor__editor--loading"
                name="eos-icons:loading"
              />
            </div>
          </template>
        </ClientOnly>
      </IFormGroup>
      <IFormGroup required>
        <IFormLabel>{{ $t('forum.create.labels.category') }}</IFormLabel>
        <ISelect
          name="category"
          :options="categories"
          :placeholder="$t('forum.create.placeholders.category')"
          :error="['invalid']"
        />
        <IFormError
          for="category"
          :visible="['invalid']"
        />
      </IFormGroup>
      <!-- TODO: get this working... -->
      <!-- <IFormGroup>
        <NuxtTurnstile class="sf-post-editor__captcha" v-model="token" />
      </IFormGroup> -->
      <IFormGroup>
        <IButton
          type="submit"
          block
          :disabled="buttonDisabled"
        >
          <Icon
            v-if="isSubmitting"
            class="sf-post-editor__loading"
            name="eos-icons:loading"
          />
          <template v-else>
            {{ $t('forum.create.labels.submit') }}
          </template>
        </IButton>
      </IFormGroup>
    </IForm>
    <IModal v-model="showConfirmation" size="lg">
      <template #header>{{ $t('forum.create.modal.title') }}</template>
      <p v-text="$t('forum.create.modal.description')" />
      <strong v-text="$t('forum.create.modal.confirmation')" />
      <section class="sf-post-editor__modal--preview">
        <h3 v-text="form?.title?.value || ''" />
        <div v-html="htmlContents" />
      </section>
      <template #footer>
        <div class="sf-post-editor__modal--footer">
          <IButton class="sf-post-editor__modal--footer-action" @click="showConfirmation = false">
            {{ $t('forum.create.modal.buttons.cancel') }}
          </IButton>
          <IButton class="sf-post-editor__modal--footer-action" color="danger" @click="onSubmit">
            {{ $t('forum.create.modal.buttons.confirm') }}
          </IButton>
        </div>
      </template>
    </IModal>
  </div>
</template>
<script setup>
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  import { useForm } from '@inkline/inkline'
  // import { usePosts } from '~/assets/composables/usePosts'
  import { usePrisma } from '~/assets/composables/usePrisma'
  import PostDisabled from './PostDisabled.vue'

  const emit = defineEmits(['error', 'success'])

  // const user = useSupabaseUser()
  const { user } = useUserSession()
  const { t } = useI18n()
  // const { createPost, getTopics, getUserById } = usePosts()
  const { getTopics, getUsername } = usePrisma()

  const topics = computedAsync(async () => await getTopics(), [])

  const categories = computed(
    () => topics.value?.map(({ id, name }) => ({ id, label: t(`forum.create.categories.${name}`) })) || []
  );

  // const { username } = await getUserById(user.value.id)
  const username = computedAsync(async () => user.value?.email ? await getUsername(user.value.email): null, null)
  const canPost = computed(() => username !== null)

  const isValidContent = (v) => v.length > 0 && v !== '\n'

  const { schema: form } = useForm({
    title: {
      validators: [
        {
          message: t('forum.create.errors.title.required'),
          name: 'required',
        },
        {
          message: t('forum.create.errors.title.tooLong'),
          name: 'maxLength',
          value: 280,
        },
      ],
    },
    category: {
      validators: [
        {
          message: t('forum.create.errors.category.required'),
          name: 'required',
        },
      ],
    },
    contents: {
      validators: [
        {
          message: t('forum.create.errors.contents.required'),
          name: 'required',
        },
        {
          name: 'custom',
          message: t('forum.create.errors.contents.empty'),
          validator: isValidContent,
        },
      ],
      value: '',
    },
  })

  const editor = ref(null)
  const htmlContents = ref('')
  const hasContent = ref(false)

  const onContentsUpdate = () => {
    hasContent.value = isValidContent(editor?.value?.getText() || '');

    form.value.contents.value = editor?.value?.getText() || ''
    form.value.contents.valid = hasContent.value
    form.value.contents.invalid = !hasContent.value
    form.value.contents.errors = hasContent.value ? [] : [form.value.contents.validators[0]]

    htmlContents.value = editor?.value?.getHTML() || ''
  }

  const isSubmitting = ref(false)
  // const token = ref(null)
  const buttonDisabled = computed(() => form?.value?.untouched || form?.value?.invalid || !hasContent.value || isSubmitting.value)

  const clearForm = () =>  {
    form.value.title.value = ''
    form.value.contents.value = ''
    editor.value.setContents('', 'silent')
    form.value.category.value = null
  }

  const showConfirmation = ref(false)

  const onSubmit = async () => {
    isSubmitting.value = true

    const payload = {
      title: form.value.title.value,
      content: htmlContents.value,
      category: form.value.category.value,
      authorId: user.value.id
    }

    try {
      // const { error } = await createPost(payload)

      if(error) throw error
      emit('success', payload)
    } catch(e) {
      emit('error', e)
    } finally {
      clearForm()
      isSubmitting.value = false
      showConfirmation.value = false
    }
  }
</script>
<style lang="scss">
.sf-post-editor {
  &__editor {
    height: 250px;

    &--fallback {
      display: flex;
      justify-content: center;
    }
  }

  &__modal {
    &--footer {
      display: flex;
      justify-content: flex-end;

      &-action {
        margin-left: 10px;
      }
    }

    &--preview {
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-top: 30px;
      max-height: 30vh;
      overflow: auto;
      padding: 10px;
    }
  }
}
</style>