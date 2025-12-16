import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ServerDataTableFetching } from '../ServerDataTableFetching'
import { ref } from 'vue'

describe('ServerDataTableFetching', () => {
  let state: any
  let fetching: ServerDataTableFetching<any>
  const mockResponse = { items: [1, 2], total: 2 }

  beforeEach(() => {
    state = {
      setLoading: vi.fn(),
      setIsRefreshing: vi.fn(),
      setItems: vi.fn(),
      updateTotalItems: vi.fn(),
      setLastFetchParams: vi.fn(),
      getPagination: vi.fn(() => ref({ page: 1, itemsPerPage: 10 })),
      getSort: vi.fn(() => ref(null)),
      getFilters: vi.fn(() => ref({ search: '', filters: {} })),
      getPayloadBuilder: vi.fn(() => (p: any) => p),
      getFetchFunction: vi.fn(() => vi.fn().mockResolvedValue(mockResponse)),
      getLastFetchParams: vi.fn(() => ref(null))
    }
    fetching = new ServerDataTableFetching(state)
  })

  it('fetchItems executes full flow', async () => {
    const response = await fetching.fetchItems()
    
    expect(state.setLoading).toHaveBeenCalledWith(true)
    expect(state.setItems).toHaveBeenCalledWith(mockResponse.items)
    expect(state.updateTotalItems).toHaveBeenCalledWith(mockResponse.total)
    expect(state.setLoading).toHaveBeenCalledWith(false)
    expect(response).toEqual(mockResponse)
  })

  it('refresh uses last params if available', async () => {
    const lastParams = { page: 2, itemsPerPage: 10 }
    state.getLastFetchParams.mockReturnValue(ref(lastParams))
    
    await fetching.refresh()
    expect(state.setLastFetchParams).toHaveBeenCalledWith(expect.objectContaining(lastParams))
  })

  it('cancelFetch aborts current request', () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort')
    fetching.fetchItems()
    fetching.cancelFetch()
    expect(abortSpy).toHaveBeenCalled()
  })
})
