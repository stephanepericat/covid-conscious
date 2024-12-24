<script setup leng="ts">
const colorMode = useColorMode()
const theme = computed(() => colorMode.value)
</script>

<template>
  <div class="w-[46px] h-[46px]">
    <ClientOnly>
      <NuxtImg
        class="transition-all duration-300 hover:opacity-70"
        :src="`/tcl-logo-big-transparent-${theme}.png`"
        :height="46"
        :width="46"
        alt="That Covid Life"
      />
    </ClientOnly>
  </div>
</template>
