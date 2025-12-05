import type { DataTableOptions } from '../../../types'
import { DataTableState } from './DataTableState'
import { DataTableSorting } from './DataTableSorting'
import { DataTablePagination } from './DataTablePagination'
import { DataTableSelection } from './DataTableSelection'

export class BaseDataTable<T = unknown> {
  protected state: DataTableState<T>
  protected sorting: DataTableSorting<T>
  protected pagination: DataTablePagination<T>
  protected selection: DataTableSelection<T>

  constructor(options: DataTableOptions<T> = {}) {
    this.state = new DataTableState<T>(options)
    this.sorting = new DataTableSorting<T>(this.state)
    this.pagination = new DataTablePagination<T>(
      this.state,
      () => this.sorting.getSortedItems()
    )
    this.selection = new DataTableSelection<T>(
      this.state,
      options.itemKey || 'id'
    )
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

  getSortedItems() {
    return this.sorting.getSortedItems()
  }

  getPaginatedItems() {
    return this.pagination.getPaginatedItems()
  }

  isAllSelected() {
    return this.selection.isAllSelected()
  }

  isPageSelected() {
    return this.selection.isPageSelected(this.getPaginatedItems().value)
  }

  isIndeterminate() {
    return this.selection.isIndeterminate()
  }

  isPageIndeterminate() {
    return this.selection.isPageIndeterminate(this.getPaginatedItems().value)
  }

  getSelectedCount() {
    return this.selection.getSelectedCount()
  }

  getSelectedIds() {
    return this.selection.getSelectedIds()
  }

  setItems(items: T[]) {
    this.state.setItems(items)
  }

  setHeaders(headers: DataTableHeader[]) {
    this.state.setHeaders(headers)
  }

  toggleSort(key: string) {
    this.sorting.toggleSort(key)
  }

  setSort(key: string, order: 'asc' | 'desc') {
    this.sorting.setSort(key, order)
  }

  clearSort() {
    this.sorting.clearSort()
  }

  setPage(page: number) {
    this.pagination.setPage(page)
  }

  nextPage() {
    this.pagination.nextPage()
  }

  previousPage() {
    this.pagination.previousPage()
  }

  goToFirstPage() {
    this.pagination.goToFirstPage()
  }

  goToLastPage() {
    this.pagination.goToLastPage()
  }

  setItemsPerPage(itemsPerPage: number) {
    this.pagination.setItemsPerPage(itemsPerPage)
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
    this.selection.selectPage(this.getPaginatedItems().value)
  }

  clearSelection() {
    this.selection.clearSelection()
  }

  isSelected(item: T): boolean {
    return this.selection.isSelected(item)
  }

  setLoading(isLoading: boolean) {
    this.state.setLoading(isLoading)
  }

  reset() {
    this.state.reset()
  }
}
