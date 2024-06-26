<template>
  <IForm
    class="user-login"
    @submit.prevent="handleLogin"
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
    <IFormGroup class="user-login__captcha">
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
        {{ $t('login.buttons.signin') }}
      </IButton>
    </IFormGroup>
  </IForm>
</template>

<script setup>
  import isEmail from 'validator/lib/isEmail'

  const emit = defineEmits(['success', 'error'])

  const client = useSupabaseClient()
  const loading = ref(false)
  const email = ref('')
  const password = ref('')
  const token = ref(null)
  const tokenValidation = computed(() => token.value || process.env.NODE_ENV === 'development')

  const submitBtnEnabled = computed(() => tokenValidation.value && email.value && password.value && isEmail(email.value) && !loading.value)

  const handleLogin = async () => {
    try {
      loading.value = true
      const { error } = await client.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      emit('success')
    } catch (error) {
      emit('error')
    } finally {
      email.value = ''
      password.value = ''
      loading.value = false
    }
  }
</script>
<style lang="scss" scoped>
.user-login {
  &__captcha {
    margin-top: 20px;
  }
 } 
</style>