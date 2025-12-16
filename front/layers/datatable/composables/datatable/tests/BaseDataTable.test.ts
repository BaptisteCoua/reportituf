import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BaseDataTable } from './BaseDataTable'
import { DataTableState } from './DataTableState'
import { DataTableSorting } from './DataTableSorting'
import { DataTablePagination } from './DataTablePagination'
import { DataTableSelection } from './DataTableSelection'
import { ref } from 'vue'

vi.mock('./DataTableState', () => ({
  DataTableState: vi.fn(() => ({
    setItems: vi.fn(),
    setHeaders: vi.fn(),
    setLoading: vi.fn(),
    reset: vi.fn(),
    getItems: vi.fn(() => ref([])),
    getHeaders: vi.fn(),
    getSort: vi.fn(),
    getPagination: vi.fn(),
    getSelectedItems: vi.fn(),
    getIsLoading: vi.fn(),
  })),
}))

vi.mock('./DataTableSorting', () => ({
  DataTableSorting: vi.fn(() => ({
    toggleSort: vi.fn(),
    setSort: vi.fn(),
    clearSort: vi.fn(),
    getSortedItems: vi.fn(() => ref([])),
  })),
}))

vi.mock('./DataTablePagination', () => ({
  DataTablePagination: vi.fn(() => ({
    setPage: vi.fn(),
    nextPage: vi.fn(),
    previousPage: vi.fn(),
    goToFirstPage: vi.fn(),
    goToLastPage: vi.fn(),
    setItemsPerPage: vi.fn(),
    getPaginatedItems: vi.fn(() => ref([])),
  })),
}))

vi.mock('./DataTableSelection', () => ({
  DataTableSelection: vi.fn(() => ({
    selectItem: vi.fn(),
    selectItems: vi.fn(),
    deselectItems: vi.fn(),
    selectAll: vi.fn(),
    selectPage: vi.fn(),
    clearSelection: vi.fn(),
    isSelected: vi.fn(),
    isAllSelected: vi.fn(),
    isPageSelected: vi.fn(),
    isIndeterminate: vi.fn(),
    isPageIndeterminate: vi.fn(),
    getSelectedCount: vi.fn(),
    getSelectedIds: vi.fn(),
  })),
}))

describe('BaseDataTable', () => {
  let table: any

  beforeEach(() => {
    vi.clearAllMocks()
    table = new BaseDataTable()
  })

  it('initialization', () => {
    expect(DataTableState).toHaveBeenCalled()
    expect(DataTableSorting).toHaveBeenCalled()
    expect(DataTablePagination).toHaveBeenCalled()
    expect(DataTableSelection).toHaveBeenCalled()
  })

  it('itemKey option', () => {
    new BaseDataTable({ itemKey: 'uuid' })
    expect(DataTableSelection).toHaveBeenCalledWith(expect.anything(), 'uuid')
  })

  it('delegation getters', () => {
    table.getItems()
    expect(table.state.getItems).toHaveBeenCalled()
    
    table.getSortedItems()
    expect(table.sorting.getSortedItems).toHaveBeenCalled()

    table.getPaginatedItems()
    expect(table.pagination.getPaginatedItems).toHaveBeenCalled()
  })

  it('delegation state actions', () => {
    const items = [{ id: 1 }]
    table.setItems(items)
    expect(table.state.setItems).toHaveBeenCalledWith(items)

    table.setLoading(true)
    expect(table.state.setLoading).toHaveBeenCalledWith(true)

    table.reset()
    expect(table.state.reset).toHaveBeenCalled()
  })

  it('delegation sorting actions', () => {
    table.toggleSort('name')
    expect(table.sorting.toggleSort).toHaveBeenCalledWith('name')

    table.clearSort()
    expect(table.sorting.clearSort).toHaveBeenCalled()
  })

  it('delegation pagination actions', () => {
    table.setPage(2)
    expect(table.pagination.setPage).toHaveBeenCalledWith(2)

    table.nextPage()
    expect(table.pagination.nextPage).toHaveBeenCalled()
  })

  it('delegation selection actions', () => {
    const item = { id: 1 }
    table.selectItem(item)
    expect(table.selection.selectItem).toHaveBeenCalledWith(item)

    table.clearSelection()
    expect(table.selection.clearSelection).toHaveBeenCalled()
  })
})
