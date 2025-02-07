<script setup lang="ts">
import PUBLICATION_BY_TYPE_QUERY from '@/sanity/queries/publicationsByType.sanity'
import { usePagination } from '@/composables/usePagination'

const {
  currentPage,
  limit,
  offset,
  onNextPage,
  onPreviousPage,
  resetPagination,
  route,
} = usePagination()

const { locale } = useI18n()

const type = computed(() => route.params.type || null)
const start = computed(() => offset.value)
const end = computed(() => offset.value + (limit.value - 1))

const { data, error, pending } = await useLazySanityQuery(
  PUBLICATION_BY_TYPE_QUERY,
  {
    start,
    end,
    locale,
    type,
  },
)

console.log('call', data.value)
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
      <div>
        <button :onClick="onPreviousPage">previous page</button> |
        <button :onClick="onNextPage">next page</button> |
        <button :onClick="resetPagination">reset</button>
      </div>
      <pre>DATA: {{ data }}</pre>
    </section>
  </div>
</template>
