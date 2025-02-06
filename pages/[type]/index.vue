<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

const type = computed(() => route.params.type || null)
const limit = computed(() => parseInt(route.query?.limit as string) || 5)
const offset = computed(() => parseInt(route.query?.offset as string) || 0)

const onPreviousPage = (e: Event) => {
  e.preventDefault()

  if (offset.value === 0) {
    return
  }

  const previousOffset = offset.value - limit.value
  router.push(`?offset=${previousOffset}&limit=${limit.value}`)
}

const onNextPage = (e: Event) => {
  e.preventDefault()

  const nextOffset = offset.value + limit.value
  router.push(`?offset=${nextOffset}&limit=${limit.value}`)
}
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
      contents (offset: {{ offset }}, limit: {{ limit }}) |
      <button :onClick="onPreviousPage">previous page</button> |
      <button :onClick="onNextPage">next page</button>
    </section>
  </div>
</template>
