import type { ServerDataTableOptions } from '../../../types'
import { ServerDataTableState } from './ServerDataTableState'
import { ServerDataTableFetching } from './ServerDataTableFetching'
import { ServerDataTableFilters } from './ServerDataTableFilters'
import { DataTableSorting } from '../datatable/DataTableSorting'
import { DataTablePagination } from '../datatable/DataTablePagination'
import { DataTableSelection } from '../datatable/DataTableSelection'

export class BaseServerDataTable<T = unknown> {
  protected state: ServerDataTableState<T>
  protected fetching: ServerDataTableFetching<T>
  protected filters: ServerDataTableFilters<T>
  protected sorting: DataTableSorting<T>
  protected pagination: DataTablePagination<T>
  protected selection: DataTableSelection<T>

  constructor(options: ServerDataTableOptions<T>) {
    this.state = new ServerDataTableState<T>(options)
    this.fetching = new ServerDataTableFetching<T>(this.state)
    this.filters = new ServerDataTableFilters<T>(
      this.state,
      this.fetching,
      options.debounceMs
    )
    this.sorting = new DataTableSorting<T>(this.state)
    this.pagination = new DataTablePagination<T>(
      this.state,
      () => this.state.getItems()
    )
    this.selection = new DataTableSelection<T>(
      this.state,
      options.itemKey || 'id'
    )

    if (options.autoFetch !== false) {
      this.fetchItems()
    }
  }

  getItems() {
    return this.state.getItems()
  }

  getHeaders() {
    return this.state.getHeaders()
  }

  getSort() {
    return this.state.getSort()
  }

  getPagination() {
    return this.state.getPagination()
  }

  getSelectedItems() {
    return this.state.getSelectedItems()
  }

  getIsLoading() {
    return this.state.getIsLoading()
  }

  getIsRefreshing() {
    return this.state.getIsRefreshing()
  }

  getPaginatedItems() {
    return this.state.getItems()
  }

  getSearch() {
    return this.filters.getSearch()
  }

  getFilters() {
    return this.filters.getFilters()
  }

  isAllSelected() {
    return this.selection.isAllSelected()
  }

  isPageSelected() {
    return this.selection.isPageSelected(this.state.getItems().value)
  }

  isIndeterminate() {
    return this.selection.isIndeterminate()
  }

  isPageIndeterminate() {
    return this.selection.isPageIndeterminate(this.state.getItems().value)
  }

  getSelectedCount() {
    return this.selection.getSelectedCount()
  }

  getSelectedIds() {
    return this.selection.getSelectedIds()
  }

  setHeaders(headers: DataTableHeader[]) {
    this.state.setHeaders(headers)
  }

  async toggleSort(key: string) {
    this.sorting.toggleSort(key)
    await this.fetchItems()
  }

  async setSort(key: string, order: 'asc' | 'desc') {
    this.sorting.setSort(key, order)
    await this.fetchItems()
  }

  async clearSort() {
    this.sorting.clearSort()
    await this.fetchItems()
  }

  async setPage(page: number) {
    this.pagination.setPage(page)
    await this.fetchItems()
  }

  async nextPage() {
    this.pagination.nextPage()
    await this.fetchItems()
  }

  async previousPage() {
    this.pagination.previousPage()
    await this.fetchItems()
  }

  async goToFirstPage() {
    this.pagination.goToFirstPage()
    await this.fetchItems()
  }

  async goToLastPage() {
    this.pagination.goToLastPage()
    await this.fetchItems()
  }

  async setItemsPerPage(itemsPerPage: number) {
    this.state.setPagination({ itemsPerPage, page: 1 })
    await this.fetchItems()
  }

  setSearch(search: string, immediate?: boolean) {
    this.filters.setSearch(search, immediate)
  }

  setFilter(key: string, value: unknown) {
    this.filters.setFilter(key, value)
  }

  setFilters(filters: Record<string, unknown>) {
    this.filters.setFilters(filters)
  }

  clearFilters() {
    this.filters.clearFilters()
  }

  clearSearch() {
    this.filters.clearSearch()
  }

  selectItem(item: T) {
    this.selection.selectItem(item)
  }

  selectItems(items: T[]) {
    this.selection.selectItems(items)
  }

  deselectItems(items: T[]) {
    this.selection.deselectItems(items)
  }

  selectAll() {
    this.selection.selectAll()
  }

  selectPage() {
    this.selection.selectPage(this.state.getItems().value)
  }

  clearSelection() {
    this.selection.clearSelection()
  }

  isSelected(item: T): boolean {
    return this.selection.isSelected(item)
  }

  async fetchItems() {
    return this.fetching.fetchItems()
  }

  async refresh() {
    return this.fetching.refresh()
  }

  cancelFetch() {
    this.fetching.cancelFetch()
  }

  reset() {
    this.state.reset()
  }
}
