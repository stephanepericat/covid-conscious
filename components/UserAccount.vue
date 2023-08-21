<template>
  <div class="sf-account">
    <IForm
      class="sf-account__form"
      @submit.prevent="updateUser"
    >
      <IFormGroup>
        <Avatar
          v-model:path="avatar_path"
          @error="emit('error')"
          @upload="updateUser"
        />
      </IFormGroup>
      <IFormGroup>
        <IFormLabel>{{ $t("supabase-forum.account.labels.email") }}</IFormLabel>
        <IInput
          v-model="user.email"
          type="text"
          name="email"
          disabled
        />
      </IFormGroup>
      <IFormGroup>
        <IFormLabel>{{ $t("supabase-forum.account.labels.username") }}</IFormLabel>
        <IInput
          v-model="username"
          type="text"
          name="username"
        />
      </IFormGroup>
      <IFormGroup>
        <IFormLabel>{{ $t("supabase-forum.account.labels.fullName") }}</IFormLabel>
        <IInput
          v-model="fullName"
          type="text"
          name="fullName"
        />
      </IFormGroup>
      <IFormGroup>
        <IFormLabel>{{ $t("supabase-forum.account.labels.website") }}</IFormLabel>
        <IInput
          v-model="website"
          type="text"
          name="website"
        />
      </IFormGroup>
      <IFormGroup>
        <IFormLabel>{{ $t("supabase-forum.account.labels.about") }}</IFormLabel>
        <ITextarea
          v-model="about"
          name="about"
        />
      </IFormGroup>
      <IFormGroup class="sf-account__submit">
        <IButton
          type="submit"
          block
          :disabled="initLoading || updateLoading"
        >
          <Icon
            v-if="updateLoading"
            name="eos-icons:loading"
          />
          {{ $t("supabase-forum.account.labels.update") }}
        </IButton>
      </IFormGroup>
    </IForm>
  </div>
</template>
<script setup>
  import { usePosts } from '../assets/composables/usePosts'
  // import { onMounted, ref, useSupabaseClient, useSupabaseUser } from '#imports'
  import Avatar from './UserAvatar.vue'

  const emit = defineEmits(['success', 'error'])

  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const { getUserById } = usePosts()

  const initLoading = ref(true)
  const updateLoading = ref(false)
  const username = ref('')
  const fullName = ref('')
  const website = ref('')
  const avatar_path = ref('')
  const about = ref('')

  const updateUser = async () => {
    updateLoading.value = true

    try {
      const updates = {
        id: user.value.id,
        username: username.value || null,
        full_name: fullName.value || null,
        website: website.value || null,
        avatar_url: avatar_path.value || null,
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

  onMounted(async () => {
    const data = await getUserById(user.value.id)

    if (data) {
      username.value = data.username || ''
      fullName.value = data.full_name || ''
      website.value = data.website || ''
      avatar_path.value = data.avatar_url || ''
      about.value = data.about || ''
    }

    initLoading.value = false
  })
</script>
<style lang="scss" scoped>
.sf-account {
  &__submit {
    margin-top: 40px;
  }
}
</style>