<template>
  <IForm
    class="sf-auth"
    @submit.prevent="handleLogin"
  >
    <IFormGroup>
      <IFormLabel>{{ $t("forum.auth.description") }}</IFormLabel>
      <IInput
        v-model="email"
        clearable
        :placeholder="$t('forum.auth.label')"
      />
    </IFormGroup>
    <IFormGroup>
      <NuxtTurnstile class="sf-auth__captcha" v-model="token" />
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
        {{ $t('forum.auth.submit') }}
      </IButton>
    </IFormGroup>
  </IForm>
</template>

<script setup>
  import isEmail from 'validator/lib/isEmail'

  const emit = defineEmits(['success', 'error'])
  const localePath = useLocalePath()

  const redirectUrl = computed(() => `${window?.location?.origin}${localePath('/callback')}`)

  if(window) {
    console.log('redirectUrl', redirectUrl.value)
  }

  const client = useSupabaseClient()
  const loading = ref(false)
  const email = ref('')
  const token = ref(null)
  const tokenValidation = computed(() => token.value || process.env.NODE_ENV === 'development')

  const submitBtnEnabled = computed(() => tokenValidation.value && email.value && isEmail(email.value) && !loading.value)

  const handleLogin = async () => {
    try {
      loading.value = true
      const { error } = await client.auth.signInWithOtp({
        email: email.value,
        options: {
          emailRedirectTo: redirectUrl.value,
        },
      })
      if (error) throw error
      emit('success')
    } catch (error) {
      emit('error')
    } finally {
      email.value = ''
      loading.value = false
    }
  }
</script>
