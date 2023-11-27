import { describe, it, expect } from 'vitest'
import { usePagination } from '~/assets/composables/usePagination'

describe('Composables > usePagination', () => {
  it('should update the amount of items per page', () => {
    const { setItemsPerPage, itemsPerPage } = usePagination()
    expect(itemsPerPage.value).toEqual(4)
    setItemsPerPage(7)
    expect(itemsPerPage.value).toEqual(7)
  })

  it('should update the start item value, whenever the current page changes', () => {
    const { currentPage, startItem } = usePagination()
    expect(startItem.value).toEqual(0)
    currentPage.value = 2
    expect(startItem.value).toEqual(4)
  })

  it('should update the end item value, whenever the current page changes', () => {
    const { currentPage, endItem } = usePagination()
    expect(endItem.value).toEqual(4)
    currentPage.value = 2
    expect(endItem.value).toEqual(8)
  })
})
