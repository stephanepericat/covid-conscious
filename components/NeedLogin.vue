<script setup>
  defineProps({
    url: { type: String, required: true },
  })
</script>

<template>
  <div class="flex flex-col items-center">
    <Icon
      class="text-[96px] mb-8"
      name="streamline:programming-browser-key-secure-password-window-browser-key-security-login"
    />
    <h2 class="text-2xl text-center" v-text="$t('needLogin.title')" />
    <p class="mb-8" v-text="$t('needLogin.description')" />
    <div>
      <IButton color="primary" :href="url">
        <template #icon>
          <Icon name="material-symbols:login-rounded" />
        </template>
        {{ $t('needLogin.cta.login') }}
      </IButton>
    </div>
  </div>
</template>
