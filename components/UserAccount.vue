<template>
  <div class="user-account">
    <div class="user-account__avatar" v-if="avatar">
      <NuxtImg
        class="user-account__avatar--visual"
        :src="avatar"
      />
      <p class="user-account__avatar--description">
        {{ $t("forum.account.labels.avatar") }} <a href="https://gravatar.com" target="_blank">gravatar.com</a>
      </p>
    </div>
    <IForm
      class="user-account__form"
      @submit.prevent="updateUser"
    >
      <IFormGroup>
        <IFormLabel>{{ $t("forum.account.labels.email") }}</IFormLabel>
        <IInput
          v-model="user.email"
          type="text"
          name="email"
          disabled
        />
      </IFormGroup>
      <IFormGroup>
        <IFormLabel>{{ $t("forum.account.labels.username") }}</IFormLabel>
        <IInput
          v-model="username"
          type="text"
          name="username"
        >
          <template #prefix>@</template>
        </IInput>
      </IFormGroup>
      <IFormGroup>
        <IFormLabel>{{ $t("forum.account.labels.fullName") }}</IFormLabel>
        <IInput
          v-model="fullName"
          type="text"
          name="fullName"
        />
      </IFormGroup>
      <IFormGroup>
        <IFormLabel>{{ $t("forum.account.labels.website") }}</IFormLabel>
        <IInput
          v-model="website"
          type="text"
          name="website"
        >
          <template #prepend>
              <span>https://</span>
          </template>
        </IInput>
      </IFormGroup>
      <IFormGroup>
        <IFormLabel>{{ $t("forum.account.labels.about") }}</IFormLabel>
        <ITextarea
          v-model="about"
          name="about"
        />
      </IFormGroup>
      <IFormGroup class="user-account__submit">
        <IButton
          type="submit"
          block
          :disabled="initLoading || updateLoading"
        >
          <Icon
            v-if="updateLoading"
            name="eos-icons:loading"
          />
          {{ $t("forum.account.labels.update") }}
        </IButton>
      </IFormGroup>
    </IForm>
  </div>
</template>
<script setup>
  import { usePosts } from '~/assets/composables/usePosts'
  import { getGravatarUrl } from '~/assets/utils/gravatar'

  const emit = defineEmits(['success', 'error'])

  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const { getUserById } = usePosts()

  const initLoading = ref(true)
  const updateLoading = ref(false)
  const username = ref('')
  const fullName = ref('')
  const website = ref('')
  const about = ref('')

  const updateUser = async () => {
    updateLoading.value = true

    try {
      const updates = {
        id: user.value.id,
        username: username.value || null, // TODO: validate username
        full_name: fullName.value || null,
        website: website.value ? `https://${website.value}` : null,
        avatar_url: null,
        about: about.value || null,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal',
      })
      if (error) throw error
      emit('success')
    } catch(e) {
      emit('error')
    } finally {
      updateLoading.value = false
    }
  }

  const avatar = ref(null)

  onMounted(async () => {
    const data = await getUserById(user.value.id)

    if (data) {
      username.value = data.username || ''
      fullName.value = data.full_name || ''
      website.value = data.website || ''
      about.value = data.about || ''
    }

    avatar.value = await getGravatarUrl(user.value.email)

    initLoading.value = false
  })
</script>
<style lang="scss" scoped>
.user-account {
  &__avatar {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;

    &--visual {
      border-radius: 50%;
      height: 150px;
      width: 150px;
    }

    &--description {
      font-size: 14px;
      margin: 20px auto 10px auto;
    }
  }

  &__submit {
    margin-top: 40px;
  }
}
</style>