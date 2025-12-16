import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DataTableSorting } from './DataTableSorting'
import { ref, computed } from 'vue'

describe('DataTableSorting', () => {
  let state: any
  let sorting: DataTableSorting<any>

  beforeEach(() => {
    state = {
      getSort: vi.fn(),
      setSort: vi.fn(),
      getItems: vi.fn()
    }
    sorting = new DataTableSorting(state)
  })

  it('toggleSort cycles through asc, desc, and null', () => {
    state.getSort.mockReturnValue(ref(null))
    sorting.toggleSort('name')
    expect(state.setSort).toHaveBeenCalledWith({ key: 'name', order: 'asc' })

    state.getSort.mockReturnValue(ref({ key: 'name', order: 'asc' }))
    sorting.toggleSort('name')
    expect(state.setSort).toHaveBeenCalledWith({ key: 'name', order: 'desc' })

    state.getSort.mockReturnValue(ref({ key: 'name', order: 'desc' }))
    sorting.toggleSort('name')
    expect(state.setSort).toHaveBeenCalledWith(null)
  })

  it('setSort and clearSort update state', () => {
    sorting.setSort('id', 'desc')
    expect(state.setSort).toHaveBeenCalledWith({ key: 'id', order: 'desc' })

    sorting.clearSort()
    expect(state.setSort).toHaveBeenCalledWith(null)
  })

  it('getSortedItems sorts basic values', () => {
    const items = [{ id: 2 }, { id: 1 }, { id: 3 }]
    state.getItems.mockReturnValue(ref(items))
    state.getSort.mockReturnValue(ref({ key: 'id', order: 'asc' }))

    const result = sorting.getSortedItems()
    expect(result.value[0].id).toBe(1)
    expect(result.value[2].id).toBe(3)
  })

  it('getSortedItems handles descending order', () => {
    const items = [{ id: 1 }, { id: 2 }]
    state.getItems.mockReturnValue(ref(items))
    state.getSort.mockReturnValue(ref({ key: 'id', order: 'desc' }))

    const result = sorting.getSortedItems()
    expect(result.value[0].id).toBe(2)
  })

  it('getSortedItems handles nested paths', () => {
    const items = [
      { user: { name: 'B' } },
      { user: { name: 'A' } }
    ]
    state.getItems.mockReturnValue(ref(items))
    state.getSort.mockReturnValue(ref({ key: 'user.name', order: 'asc' }))

    const result = sorting.getSortedItems()
    expect(result.value[0].user.name).toBe('A')
  })

  it('getSortedItems returns original items if no sort', () => {
    const items = [{ id: 1 }]
    state.getItems.mockReturnValue(ref(items))
    state.getSort.mockReturnValue(ref(null))

    const result = sorting.getSortedItems()
    expect(result.value).toEqual(items)
  })
})
