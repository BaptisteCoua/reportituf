export * from '../types'
export * from './core/payload-builders'
export { BaseDataTable } from './core/datatable/BaseDataTable'
export { BaseServerDataTable } from './core/server-datatable/BaseServerDataTable'

import { BaseDataTable } from './core/datatable/BaseDataTable'
import { BaseServerDataTable } from './core/server-datatable/BaseServerDataTable'
import type { DataTableOptions, ServerDataTableOptions, DataTableHeader } from '../types'

export function useDataTable<T = unknown>(options: DataTableOptions<T> = {}) {
  const dataTable = new BaseDataTable<T>(options)

  return {
    items: dataTable.getItems(),
    headers: dataTable.getHeaders(),
    sort: dataTable.getSort(),
    pagination: dataTable.getPagination(),
    selectedItems: dataTable.getSelectedItems(),
    isLoading: dataTable.getIsLoading(),
    sortedItems: dataTable.getSortedItems(),
    paginatedItems: dataTable.getPaginatedItems(),
    isAllSelected: dataTable.isAllSelected(),
    isPageSelected: dataTable.isPageSelected(),
    isIndeterminate: dataTable.isIndeterminate(),
    isPageIndeterminate: dataTable.isPageIndeterminate(),
    selectedCount: dataTable.getSelectedCount(),
    selectedIds: dataTable.getSelectedIds(),
    
    setItems: dataTable.setItems.bind(dataTable),
    setHeaders: dataTable.setHeaders.bind(dataTable),
    toggleSort: dataTable.toggleSort.bind(dataTable),
    setSort: dataTable.setSort.bind(dataTable),
    clearSort: dataTable.clearSort.bind(dataTable),
    setPage: dataTable.setPage.bind(dataTable),
    nextPage: dataTable.nextPage.bind(dataTable),
    previousPage: dataTable.previousPage.bind(dataTable),
    goToFirstPage: dataTable.goToFirstPage.bind(dataTable),
    goToLastPage: dataTable.goToLastPage.bind(dataTable),
    setItemsPerPage: dataTable.setItemsPerPage.bind(dataTable),
    selectItem: dataTable.selectItem.bind(dataTable),
    selectItems: dataTable.selectItems.bind(dataTable),
    deselectItems: dataTable.deselectItems.bind(dataTable),
    selectAll: dataTable.selectAll.bind(dataTable),
    selectPage: dataTable.selectPage.bind(dataTable),
    clearSelection: dataTable.clearSelection.bind(dataTable),
    isSelected: dataTable.isSelected.bind(dataTable),
    setLoading: dataTable.setLoading.bind(dataTable),
    reset: dataTable.reset.bind(dataTable),
  }
}

export function useServerDataTable<T = unknown>(options: ServerDataTableOptions<T>) {
  const serverDataTable = new BaseServerDataTable<T>(options)

  return {
    items: serverDataTable.getItems(),
    headers: serverDataTable.getHeaders(),
    sort: serverDataTable.getSort(),
    pagination: serverDataTable.getPagination(),
    selectedItems: serverDataTable.getSelectedItems(),
    isLoading: serverDataTable.getIsLoading(),
    isRefreshing: serverDataTable.getIsRefreshing(),
    paginatedItems: serverDataTable.getPaginatedItems(),
    search: serverDataTable.getSearch(),
    filters: serverDataTable.getFilters(),
    isAllSelected: serverDataTable.isAllSelected(),
    isPageSelected: serverDataTable.isPageSelected(),
    isIndeterminate: serverDataTable.isIndeterminate(),
    isPageIndeterminate: serverDataTable.isPageIndeterminate(),
    selectedCount: serverDataTable.getSelectedCount(),
    selectedIds: serverDataTable.getSelectedIds(),
    
    setHeaders: serverDataTable.setHeaders.bind(serverDataTable),
    toggleSort: serverDataTable.toggleSort.bind(serverDataTable),
    setSort: serverDataTable.setSort.bind(serverDataTable),
    clearSort: serverDataTable.clearSort.bind(serverDataTable),
    setPage: serverDataTable.setPage.bind(serverDataTable),
    nextPage: serverDataTable.nextPage.bind(serverDataTable),
    previousPage: serverDataTable.previousPage.bind(serverDataTable),
    goToFirstPage: serverDataTable.goToFirstPage.bind(serverDataTable),
    goToLastPage: serverDataTable.goToLastPage.bind(serverDataTable),
    setItemsPerPage: serverDataTable.setItemsPerPage.bind(serverDataTable),
    setSearch: serverDataTable.setSearch.bind(serverDataTable),
    setFilter: serverDataTable.setFilter.bind(serverDataTable),
    setFilters: serverDataTable.setFilters.bind(serverDataTable),
    clearFilters: serverDataTable.clearFilters.bind(serverDataTable),
    clearSearch: serverDataTable.clearSearch.bind(serverDataTable),
    selectItem: serverDataTable.selectItem.bind(serverDataTable),
    selectItems: serverDataTable.selectItems.bind(serverDataTable),
    deselectItems: serverDataTable.deselectItems.bind(serverDataTable),
    selectAll: serverDataTable.selectAll.bind(serverDataTable),
    selectPage: serverDataTable.selectPage.bind(serverDataTable),
    clearSelection: serverDataTable.clearSelection.bind(serverDataTable),
    isSelected: serverDataTable.isSelected.bind(serverDataTable),
    fetchItems: serverDataTable.fetchItems.bind(serverDataTable),
    refresh: serverDataTable.refresh.bind(serverDataTable),
    cancelFetch: serverDataTable.cancelFetch.bind(serverDataTable),
    reset: serverDataTable.reset.bind(serverDataTable),
  }
}
