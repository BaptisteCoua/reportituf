import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DataTablePagination } from '../DataTablePagination'
import { ref, computed } from 'vue'

describe('DataTablePagination', () => {
  let state: any
  let pagination: DataTablePagination<any>
  let mockSortedItems: any

  beforeEach(() => {
    mockSortedItems = ref([])
    state = {
      getPagination: vi.fn(() => ref({
        page: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0
      })),
      setPagination: vi.fn(),
      getItems: vi.fn(() => ref([])),
      updateTotalItems: vi.fn()
    }
    pagination = new DataTablePagination(state, () => computed(() => mockSortedItems.value))
  })

  it('setPage constraints', () => {
    state.getPagination.mockReturnValue(ref({ page: 1, totalPages: 5 }))
    
    pagination.setPage(3)
    expect(state.setPagination).toHaveBeenCalledWith({ page: 3 })

    pagination.setPage(0)
    expect(state.setPagination).toHaveBeenCalledWith({ page: 1 })

    pagination.setPage(10)
    expect(state.setPagination).toHaveBeenCalledWith({ page: 5 })
  })

  it('nextPage increment', () => {
    state.getPagination.mockReturnValue(ref({ page: 1, totalPages: 3 }))
    pagination.nextPage()
    expect(state.setPagination).toHaveBeenCalledWith({ page: 2 })
  })

  it('previousPage decrement', () => {
    state.getPagination.mockReturnValue(ref({ page: 2, totalPages: 3 }))
    pagination.previousPage()
    expect(state.setPagination).toHaveBeenCalledWith({ page: 1 })
  })

  it('setItemsPerPage resets to page 1', () => {
    state.getItems.mockReturnValue(ref([1, 2, 3]))
    pagination.setItemsPerPage(20)
    expect(state.setPagination).toHaveBeenCalledWith({ itemsPerPage: 20, page: 1 })
    expect(state.updateTotalItems).toHaveBeenCalledWith(3)
  })

  it('getPaginatedItems slicing', () => {
    mockSortedItems.value = [1, 2, 3, 4, 5]
    state.getPagination.mockReturnValue(ref({ page: 2, itemsPerPage: 2 }))
    
    const result = pagination.getPaginatedItems()
    expect(result.value).toEqual([3, 4])
  })

  it('goToFirstPage and goToLastPage', () => {
    state.getPagination.mockReturnValue(ref({ page: 2, totalPages: 10 }))
    
    pagination.goToFirstPage()
    expect(state.setPagination).toHaveBeenCalledWith({ page: 1 })

    pagination.goToLastPage()
    expect(state.setPagination).toHaveBeenCalledWith({ page: 10 })
  })
})
