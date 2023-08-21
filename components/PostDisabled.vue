<template>
  <IAlert color="warning">
    <template #icon>
      <IIcon name="ink-warning" />
    </template>
    <span>{{ $t(`supabase-forum.disabled.message.${type}`) }}&nbsp;</span>
    <NuxtLink :to="localePath(`${rootPath}/account`)">
      {{ $t('supabase-forum.disabled.redirect') }}
    </NuxtLink>
  </IAlert>
</template>
<script setup>
  import { computed } from '#imports'
  // import { useRuntimeConfig } from '#app'

  const props = defineProps({
    type: { type: String, required: true, validator: (val) => ['comment', 'post'].includes(val) },
  })

  const config = useRuntimeConfig()
  const rootPath = computed(() => config.public.supabaseForum.rootPath)
</script>