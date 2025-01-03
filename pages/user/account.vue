<script setup lang="ts">
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
</script>

<template>
  <div>Welcome, {{ userStore.info?.email || '' }}!</div>
</template>
