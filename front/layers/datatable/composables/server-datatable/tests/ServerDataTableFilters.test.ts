import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ServerDataTableFilters } from '../ServerDataTableFilters'
import { ref } from 'vue'

describe('ServerDataTableFilters', () => {
  let state: any
  let fetching: any
  let filters: ServerDataTableFilters<any>

  beforeEach(() => {
    vi.useFakeTimers()
    state = {
      setSearch: vi.fn(),
      setFilter: vi.fn(),
      setFilters: vi.fn(),
      clearFilters: vi.fn(),
      setPagination: vi.fn(),
      getFilters: vi.fn(() => ref({ search: '', filters: {} }))
    }
    fetching = { fetchItems: vi.fn() }
    filters = new ServerDataTableFilters(state, fetching, 300)
  })

  it('setSearch debounces fetch', () => {
    filters.setSearch('query')
    expect(state.setSearch).toHaveBeenCalledWith('query')
    expect(fetching.fetchItems).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(state.setPagination).toHaveBeenCalledWith({ page: 1 })
    expect(fetching.fetchItems).toHaveBeenCalled()
  })

  it('setSearch immediate bypasses debounce', () => {
    filters.setSearch('query', true)
    expect(fetching.fetchItems).toHaveBeenCalled()
  })

  it('setFilter triggers immediate fetch', () => {
    filters.setFilter('status', 'active')
    expect(state.setFilter).toHaveBeenCalledWith('status', 'active')
    expect(fetching.fetchItems).toHaveBeenCalled()
  })

  it('clearFilters resets state and fetches', () => {
    filters.clearFilters()
    expect(state.clearFilters).toHaveBeenCalled()
    expect(fetching.fetchItems).toHaveBeenCalled()
  })
})
