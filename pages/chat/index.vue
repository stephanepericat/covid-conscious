<script setup lang="ts">
import { motion } from 'motion-v'

definePageMeta({
  layout: 'chat',
})
</script>

<template>
  <motion.div
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    class="flex flex-col items-center justify-center overflow-hidden h-full"
  >
    <h1>Chat</h1>
  </motion.div>
</template>
