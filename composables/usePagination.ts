export const usePagination = () => {
  const route = useRoute()
  const router = useRouter()

  const DEFAULT_LIMIT = 5
  const DEFAULT_OFFSET = 0
  const limit = computed(
    () => parseInt(route.query?.limit as string) || DEFAULT_LIMIT,
  )
  const offset = computed(
    () => parseInt(route.query?.offset as string) || DEFAULT_OFFSET,
  )
  const currentPage = computed(() => Math.ceil(offset.value / limit.value) + 1)

  const go = (l: number, o: number) => router.push(`?limit=${l}&offset=${o}`)

  const onPreviousPage = (e: Event) => {
    e.preventDefault()

    if (offset.value === 0) {
      return
    }

    const previousOffset = offset.value - limit.value
    go(limit.value, previousOffset)
  }

  const onNextPage = (e: Event, total: number) => {
    e.preventDefault()

    const nextOffset = offset.value + limit.value

    if (nextOffset >= total) {
      return
    }

    go(limit.value, nextOffset)
  }

  const resetPagination = () => {
    go(DEFAULT_LIMIT, DEFAULT_OFFSET)
  }

  return {
    currentPage,
    limit,
    offset,
    onNextPage,
    onPreviousPage,
    resetPagination,
    route,
  }
}
