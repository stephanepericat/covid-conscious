<template>
  <li v-if="free" class="mr-2 mb-2 mt-0 ml-0">
    <IBadge
      class="uppercase tracking-widest mb-0"
      color="secondary"
      :size="size"
    >
      <Icon
        class="icon"
        name="material-symbols:free-cancellation-outline-rounded"
      />{{ $t('article.free') }}
    </IBadge>
  </li>
  <li v-if="onlineOnly" class="mr-2 mb-2 mt-0 ml-0">
    <IBadge
      class="uppercase tracking-widest mb-0"
      color="secondary"
      :size="size"
    >
      <Icon class="icon" name="oui:online" />{{ $t('article.online') }}
    </IBadge>
  </li>
  <li v-if="limited" class="mr-2 mb-2 mt-0 ml-0">
    <IBadge class="uppercase tracking-widest mb-0" color="warning" :size="size">
      <Icon class="icon" name="line-md:alert-circle" />{{
        $t('article.limited')
      }}
    </IBadge>
  </li>
  <li v-if="premium" class="mr-2 mb-2 mt-0 ml-0">
    <IBadge class="uppercase tracking-widest mb-0" color="danger" :size="size">
      <Icon class="icon" name="material-symbols:lock" />{{
        $t('article.locked')
      }}
    </IBadge>
  </li>
</template>
<script setup>
defineProps({
  free: Boolean,
  limited: Boolean,
  onlineOnly: Boolean,
  premium: Boolean,
  size: { type: String, default: 'md' },
})
</script>
<style lang="scss" scoped>
.icon {
  margin-right: 3px;
  vertical-align: top !important;
}
</style>
