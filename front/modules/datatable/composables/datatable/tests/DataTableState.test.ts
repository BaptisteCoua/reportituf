import { describe, it, expect } from 'vitest'
import { DataTableState } from '../DataTableState'

describe('DataTableState', () => {
  it('initializes with default values', () => {
    const state = new DataTableState()
    expect(state.getItems().value).toEqual([])
    expect(state.getPagination().value.page).toBe(1)
    expect(state.getIsLoading().value).toBe(false)
  })

  it('initializes with options', () => {
    const options = {
      headers: [{ key: 'id', title: 'ID' }],
      items: [{ id: 1 }],
      itemsPerPage: 25,
      sortBy: 'id',
      sortOrder: 'asc' as const
    }
    const state = new DataTableState(options)
    expect(state.getHeaders().value).toEqual(options.headers)
    expect(state.getItems().value).toEqual(options.items)
    expect(state.getPagination().value.itemsPerPage).toBe(25)
    expect(state.getSort().value).toEqual({ key: 'id', order: 'asc' })
  })

  it('updates items and total pagination', () => {
    const state = new DataTableState({ itemsPerPage: 5 })
    const items = Array(12).fill({ id: 1 })
    state.setItems(items)
    
    expect(state.getItems().value).toHaveLength(12)
    expect(state.getPagination().value.totalItems).toBe(12)
    expect(state.getPagination().value.totalPages).toBe(3)
  })

  it('updates loading state', () => {
    const state = new DataTableState()
    state.setLoading(true)
    expect(state.getIsLoading().value).toBe(true)
  })

  it('updates partial pagination', () => {
    const state = new DataTableState()
    state.setPagination({ page: 3 })
    expect(state.getPagination().value.page).toBe(3)
    expect(state.getPagination().value.itemsPerPage).toBe(10)
  })

  it('resets state', () => {
    const state = new DataTableState({ items: [{ id: 1 }] })
    state.setLoading(true)
    state.reset()
    
    expect(state.getItems().value).toEqual([])
    expect(state.getIsLoading().value).toBe(false)
    expect(state.getPagination().value.page).toBe(1)
  })
})
