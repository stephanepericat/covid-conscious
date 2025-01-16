<script setup lang="ts">
const route = useRoute()
const type = computed(() => route.params.type || null)
</script>

<template>
  <div class="container pt-4 md:pt-8">
    <h1
      class="scroll-m-20 text-4xl font-extrabold lg:text-5xl font-title uppercase"
    >
      {{ $t(`layout.${type}`) }}
    </h1>
    <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
      {{ $t(`description.${type}`) }}
    </h4>
    <section class="mt-4 md:mt-8">contents</section>
  </div>
</template>
