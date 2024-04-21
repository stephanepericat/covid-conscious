<template>
  <IForm
    class="user-password-update"
    @submit.prevent="handleUpdatePassword"
  >
    <IFormGroup>
      <IFormLabel>{{ $t("login.labels.password") }}</IFormLabel>
      <IInput
        v-model="password"
        :placeholder="$t('login.placeholders.newPassword')"
        type="password"
        required
      />
    </IFormGroup>
    <IFormGroup class="user-password-update__captcha">
      <NuxtTurnstile v-model="token" />
    </IFormGroup>
    <IFormGroup>
      <IButton
        block
        type="submit"
        :disabled="!submitBtnEnabled"
      >
        <Icon
          v-if="loading"
          name="eos-icons:loading"
        />
        {{ $t('login.buttons.updatePassword') }}
      </IButton>
    </IFormGroup>
  </IForm>
</template>

<script setup>
  const emit = defineEmits(['success', 'error'])

  const client = useSupabaseClient()
  const loading = ref(false)
  const password = ref('')
  const token = ref(null)
  const tokenValidation = computed(() => token.value || process.env.NODE_ENV === 'development')

  const submitBtnEnabled = computed(() => tokenValidation.value && password.value && !loading.value)

  const handleUpdatePassword = async () => {
    try {
      loading.value = true

      const { error } = await client.auth.updateUser({
        password: password.value
      })
      if (error) throw error
      emit('success')
    } catch (error) {
      console.log('error', error)
      emit('error')
    } finally {
      password.value = ''
      loading.value = false
    }
  }
</script>
<style lang="scss" scoped>
.user-password-update {
  &__captcha {
    margin-top: 20px;
  }
 } 
</style>