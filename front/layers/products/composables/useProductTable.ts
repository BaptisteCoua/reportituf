import { ServerDataTable } from '../../../modules/datatable-v2/src/ServerDataTable'
import type { ServerDataTableOptions } from '../../../modules/datatable-v2/src/types/ServerDataTable.types'
import type { Product } from '../types'
import { ProductService } from '../services/ProductService'

const headers = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'images', label: 'Image', sortable: false, width: '80px' },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'price', label: 'Price', sortable: true, width: '120px' },
  { key: 'category.name', label: 'Category', sortable: true, width: '150px' },
  { key: 'creationAt', label: 'Created', sortable: true, width: '150px' },
  { key: 'actions', label: 'Actions', sortable: false, width: '100px' }
]

export function useProductTable() {
  const options: ServerDataTableOptions<Product> = {
    headers,
    itemsPerPage: 10,
    itemKey: 'id',
    debounceMs: 300,
    async fetchFunction(payload) {
      const allProducts = await ProductService.getAll()

      let filtered = [...allProducts]

      const params = payload as {
        page: number
        per_page: number
        search?: string
        sort_by?: string
        sort_order?: 'asc' | 'desc'
        filters?: { categoryId?: number }
      }

      if (params.search) {
        const search = params.search.toLowerCase()
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search)
        )
      }

      if (params.filters?.categoryId) {
        filtered = filtered.filter(product =>
          product.category.id === params.filters?.categoryId
        )
      }

      if (params.sort_by) {
        filtered.sort((a, b) => {
          let aVal: string | number
          let bVal: string | number

          if (params.sort_by === 'category.name') {
            aVal = a.category.name
            bVal = b.category.name
          } else {
            aVal = a[params.sort_by as keyof Product] as string | number
            bVal = b[params.sort_by as keyof Product] as string | number
          }

          const comparison = String(aVal).localeCompare(String(bVal))
          return params.sort_order === 'desc' ? -comparison : comparison
        })
      }

      const start = (params.page - 1) * params.per_page
      const end = start + params.per_page
      const paginatedItems = filtered.slice(start, end)

      return {
        items: paginatedItems,
        total: filtered.length
      }
    }
  }

  const table = new ServerDataTable<Product>(options)

  return {
    items: table.getItems(),
    headers: table.getHeaders(),
    sort: table.getSort(),
    pagination: table.getPagination(),
    selectedItems: table.getSelectedItems(),
    isLoading: table.getIsLoading(),
    isRefreshing: table.getIsRefreshing(),
    search: table.getSearch(),
    filters: table.getFilters(),
    isAllSelected: table.isAllSelected(),
    isPageSelected: table.isPageSelected(),
    selectedCount: table.getSelectedCount(),

    setHeaders: table.setHeaders.bind(table),
    toggleSort: table.toggleSort.bind(table),
    setSort: table.setSort.bind(table),
    clearSort: table.clearSort.bind(table),
    setPage: table.setPage.bind(table),
    nextPage: table.nextPage.bind(table),
    previousPage: table.previousPage.bind(table),
    goToFirstPage: table.goToFirstPage.bind(table),
    goToLastPage: table.goToLastPage.bind(table),
    setItemsPerPage: table.setItemsPerPage.bind(table),
    setSearch: table.setSearch.bind(table),
    setFilter: table.setFilter.bind(table),
    setFilters: table.setFilters.bind(table),
    clearFilters: table.clearFilters.bind(table),
    clearSearch: table.clearSearch.bind(table),
    selectItem: table.selectItem.bind(table),
    selectAll: table.selectAll.bind(table),
    clearSelection: table.clearSelection.bind(table),
    isSelected: table.isSelected.bind(table),
    fetchItems: table.fetchItems.bind(table),
    refresh: table.refresh.bind(table),
    reset: table.reset.bind(table)
  }
}
