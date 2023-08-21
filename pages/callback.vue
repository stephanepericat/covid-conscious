<template>
  <div class="sf-callback-page">
    <Icon
      class="sf-callback-page__loader"
      name="eos-icons:loading"
    />
  </div>
</template>
<script setup>
  // import { navigateTo, useRouter, useLocalePath, useSupabaseUser, watch } from '#imports'
  // import { useRuntimeConfig } from '#app'
  definePageMeta({
    layout: 'empty'
  })

  const localePath = useLocalePath()
  const user = useSupabaseUser()

  watch(user, () => {
    if (user.value) {
      return navigateTo(localePath('/account'))
    }
  }, { immediate: true })
</script>
<style lang="scss" scoped>
  .sf-callback-page {
    display: flex;
    justify-content: center;

    &__loader {
      height: 80px;
      width: 80px;
    }
  }
</style>