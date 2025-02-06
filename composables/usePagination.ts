export const usePagination = () => {
  const route = useRoute()
  const router = useRouter()

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

  return {
    limit,
    offset,
    onNextPage,
    onPreviousPage,
    route,
  }
}
