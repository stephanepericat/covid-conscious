<script setup lang="ts">
const host = computed(() => window?.location?.origin || '')
</script>

<template>
  <div class="home-page">
    <TclSeo
      :description="$t('layout.description')"
      :image="`${host}/tcl-fallback-169.jpg`"
      image-type="image/jpeg"
      :title="$t('layout.home')"
    />

    <h1 class="font-title text-5xl font-bold uppercase">
      {{ $t('layout.tcl') }}
    </h1>
    <Button>Click me!</Button>
  </div>
</template>
