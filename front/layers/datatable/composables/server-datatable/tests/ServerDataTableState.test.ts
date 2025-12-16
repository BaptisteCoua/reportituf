import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ServerDataTableState } from '../ServerDataTableState'
import { isComputed } from 'vue'

describe('ServerDataTableState', () => {
  const mockFetch = vi.fn().mockResolvedValue({ items: [], total: 0 })
  const options = {
    fetchFunction: mockFetch,
    headers: [{ key: 'id', title: 'ID' }],
  }

  let state: ServerDataTableState<any>

  beforeEach(() => {
    vi.clearAllMocks()
    state = new ServerDataTableState(options)
  })

  it('initializes with fetch function and default payload builder', () => {
    expect(state.getFetchFunction()).toBe(mockFetch)
    expect(typeof state.getPayloadBuilder()).toBe('function')
  })

  it('manages refreshing state via computed', () => {
    expect(state.getIsRefreshing().value).toBe(false)
    state.setIsRefreshing(true)
    expect(state.getIsRefreshing().value).toBe(true)
    expect(isComputed(state.getIsRefreshing())).toBe(true)
  })

  it('stores last fetch parameters', () => {
    const params = { page: 2, itemsPerPage: 20, search: 'test' }
    state.setLastFetchParams(params as any)
    expect(state.getLastFetchParams().value).toEqual(params)
  })

  it('manipulates filters and search correctly', () => {
    state.setSearch('test query')
    expect(state.getFilters().value.search).toBe('test query')

    state.setFilter('status', 'active')
    expect(state.getFilters().value.filters.status).toBe('active')

    state.setFilters({ search: 'new query' })
    expect(state.getFilters().value.search).toBe('new query')
  })

  it('resets filters to initial state', () => {
    state.setSearch('test')
    state.setFilter('category', 'books')
    state.clearFilters()
    
    expect(state.getFilters().value).toEqual({
      search: '',
      filters: {}
    })
  })
})
