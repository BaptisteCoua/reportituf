import type { ServerDataTableState } from './ServerDataTableState'
import type { ServerDataTableFetching } from './ServerDataTableFetching'

export class ServerDataTableFilters<T = unknown> {
  protected searchDebounce: ReturnType<typeof setTimeout> | null = null
  protected debounceMs: number

  constructor(
    protected state: ServerDataTableState<T>,
    protected fetching: ServerDataTableFetching<T>,
    debounceMs: number = 300
  ) {
    this.debounceMs = debounceMs
  }

  setSearch(search: string, immediate: boolean = false) {
    this.state.setSearch(search)

    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce)
    }

    if (immediate) {
      this.state.setPagination({ page: 1 })
      this.fetching.fetchItems()
    } else {
      this.searchDebounce = setTimeout(() => {
        this.state.setPagination({ page: 1 })
        this.fetching.fetchItems()
      }, this.debounceMs)
    }
  }

  setFilter(key: string, value: unknown) {
    this.state.setFilter(key, value)
    this.state.setPagination({ page: 1 })
    this.fetching.fetchItems()
  }

  setFilters(filters: Record<string, unknown>) {
    this.state.setFilters({ filters })
    this.state.setPagination({ page: 1 })
    this.fetching.fetchItems()
  }

  clearFilters() {
    this.state.clearFilters()
    this.state.setPagination({ page: 1 })
    this.fetching.fetchItems()
  }

  clearSearch() {
    this.setSearch('', true)
  }

  getSearch() {
    return computed(() => this.state.getFilters().value.search)
  }

  getFilters() {
    return computed(() => this.state.getFilters().value.filters)
  }
}
