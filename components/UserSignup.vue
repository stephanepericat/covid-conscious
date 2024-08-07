<template>
  <IForm
    class="user-signup"
    @submit.prevent="handleSignup"
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
    <IFormGroup>
      <IFormLabel>{{ $t("login.labels.password") }}</IFormLabel>
      <IInput
        v-model="password"
        :placeholder="$t('login.placeholders.password')"
        type="password"
        required
      />
    </IFormGroup>
    <IFormGroup class="user-signup__captcha">
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
        {{ $t('login.buttons.signup') }}
      </IButton>
    </IFormGroup>
  </IForm>
</template>

<script setup>
  import isEmail from 'validator/lib/isEmail'

  const emit = defineEmits(['success', 'error'])
  const { locale } = useI18n()

  const redirectUrl = computed(() => `${window?.location?.origin}/api/auth/callback?locale=${locale.value}`)

  const client = useSupabaseClient()
  const loading = ref(false)
  const email = ref('')
  const password = ref('')
  const token = ref(null)
  const tokenValidation = computed(() => token.value || process.env.NODE_ENV === 'development')

  const submitBtnEnabled = computed(() => tokenValidation.value && email.value && password.value && isEmail(email.value) && !loading.value)

  const handleSignup = async () => {
    try {
      loading.value = true

      const { error } = await client.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          emailRedirectTo: redirectUrl.value
        }
      })
      if (error) throw error
      emit('success')
    } catch (error) {
      console.log('error', error)
      emit('error')
    } finally {
      email.value = ''
      password.value = ''
      loading.value = false
    }
  }
</script>
<style lang="scss" scoped>
.user-signup {
  &__captcha {
    margin-top: 20px;
  }
 } 
</style>