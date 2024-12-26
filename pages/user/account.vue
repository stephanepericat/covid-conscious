<script setup lang="ts">
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
</script>

<template>
  <div class="account-page">Welcome, {{ userStore.info?.email || '' }}!</div>
</template>
