<template>
  <IForm
    class="password-reset-request"
    @submit.prevent="handleResetRequest"
  >
    <IFormGroup>
      <IFormLabel>{{ $t("login.labels.email") }}</IFormLabel>
      <IInput
        v-model="email"
        :placeholder="$t('login.placeholders.email')"
        type="email"
        required
      />
    </IFormGroup>
    <IFormGroup class="password-reset-request__captcha">
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
        {{ $t('login.buttons.resetPassword') }}
      </IButton>
    </IFormGroup>
  </IForm>
</template>

<script setup>
  import isEmail from 'validator/lib/isEmail'

  const emit = defineEmits(['success', 'error'])
  const localePath = useLocalePath()

  const redirectUrl = computed(() => `${window?.location?.origin}${localePath('/update-password')}`)

  const client = useSupabaseClient()
  const loading = ref(false)
  const email = ref('')
  const token = ref(null)
  const tokenValidation = computed(() => token.value || process.env.NODE_ENV === 'development')

  const submitBtnEnabled = computed(() => tokenValidation.value && email.value && isEmail(email.value) && !loading.value)

  const handleResetRequest = async () => {
    try {
      loading.value = true

      const { error } = await client.auth.resetPasswordForEmail(email.value, {
        redirectTo: redirectUrl.value,
      })
      if (error) throw error
      emit('success')
    } catch (error) {
      console.log('error', error)
      emit('error')
    } finally {
      email.value = ''
      loading.value = false
    }
  }
</script>
<style lang="scss" scoped>
.password-reset-request {
  &__captcha {
    margin-top: 20px;
  }
 } 
</style>