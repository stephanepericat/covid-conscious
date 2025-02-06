<script setup lang="ts">
import { usePagination } from '@/composables/usePagination'

const { currentPage, limit, offset, onNextPage, onPreviousPage, route } =
  usePagination()
const type = computed(() => route.params.type || null)
</script>

<template>
  <div class="container pt-4 md:pt-8">
    <div class="flex justify-between items-center">
      <div>
        <h1
          class="scroll-m-20 text-4xl font-extrabold lg:text-5xl font-title uppercase"
        >
          {{ $t(`layout.${type}`) }}
        </h1>
        <h4
          class="scroll-m-20 text-base lg:text-xl font-semibold tracking-tight"
        >
          {{ $t(`description.${type}`) }}
        </h4>
      </div>
      <TclFiltersSheet />
    </div>
    <section class="mt-4 md:mt-8">
      <ul>
        <li>OFFSET: {{ offset }}</li>
        <li>LIMIT: {{ limit }}</li>
        <li>CURRENT PAGE: {{ currentPage }}</li>
      </ul>
      <button :onClick="onPreviousPage">previous page</button> |
      <button :onClick="onNextPage">next page</button>
    </section>
  </div>
</template>
