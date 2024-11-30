<template>
  <IAlert color="warning">
    <template #icon>
      <IIcon name="ink-warning" />
    </template>
    <span>{{ $t(`forum.disabled.message.${type}`) }}&nbsp;</span>
    <NuxtLink :to="localePath('/account')">
      {{ $t('forum.disabled.redirect') }}
    </NuxtLink>
  </IAlert>
</template>
<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (val) => ['comment', 'post'].includes(val),
  },
})
</script>
