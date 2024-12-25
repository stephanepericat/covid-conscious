<script setup lang="ts">
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

useAsyncData(async () => await userStore.updateUserInfo())
</script>

<template>
  <div class="font-sans">
    <TclHeader />
    <TclBody>
      <NuxtPage />
    </TclBody>
  </div>
</template>
