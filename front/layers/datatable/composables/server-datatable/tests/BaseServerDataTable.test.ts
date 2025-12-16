import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BaseServerDataTable } from '../BaseServerDataTable'
import { ref } from 'vue'

vi.mock('../ServerDataTableState')
vi.mock('../ServerDataTableFetching')
vi.mock('../ServerDataTableFilters')

describe('BaseServerDataTable', () => {
  const options = { fetchFunction: async () => ({ items: [], total: 0 }), autoFetch: false }
  let table: any

  beforeEach(() => {
    table = new BaseServerDataTable(options)
  })

  it('delegates fetchItems to fetching component', async () => {
    await table.fetchItems()
    expect(table.fetching.fetchItems).toHaveBeenCalled()
  })

  it('delegates pagination with fetch', async () => {
    await table.setPage(2)
    expect(table.pagination.setPage).toHaveBeenCalledWith(2)
    expect(table.fetching.fetchItems).toHaveBeenCalled()
  })

  it('delegates sorting with fetch', async () => {
    await table.toggleSort('name')
    expect(table.sorting.toggleSort).toHaveBeenCalledWith('name')
    expect(table.fetching.fetchItems).toHaveBeenCalled()
  })

  it('delegates filter actions', () => {
    table.setSearch('test')
    expect(table.filters.setSearch).toHaveBeenCalledWith('test', undefined)
    
    table.clearFilters()
    expect(table.filters.clearFilters).toHaveBeenCalled()
  })

  it('delegates selection actions without fetch', () => {
    const item = { id: 1 }
    table.selectItem(item)
    expect(table.selection.selectItem).toHaveBeenCalledWith(item)
  })
})
