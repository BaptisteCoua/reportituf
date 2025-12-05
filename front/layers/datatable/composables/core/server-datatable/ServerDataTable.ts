import type { ServerDataTableOptions, ServerFetchParams, DataTableFilters, PayloadBuilderFunction } from '../../../types'
import { DataTableState } from '../datatable/DataTableState'
import { defaultPayloadBuilder } from '../payload-builders'

export class ServerDataTableState<T = unknown> extends DataTableState<T> {
  protected fetchFunction: (payload: unknown) => Promise<{ items: T[]; total: number }>
  protected payloadBuilder: PayloadBuilderFunction
  protected isRefreshing = ref(false)
  protected lastFetchParams = ref<ServerFetchParams | null>(null)
  protected filters = ref<DataTableFilters>({
    search: '',
    filters: {}
  })

  constructor(options: ServerDataTableOptions<T>) {
    super(options)
    this.fetchFunction = options.fetchFunction
    this.payloadBuilder = options.payloadBuilder || defaultPayloadBuilder
  }

  getFetchFunction() {
    return this.fetchFunction
  }

  getPayloadBuilder() {
    return this.payloadBuilder
  }

  getIsRefreshing() {
    return computed(() => this.isRefreshing.value)
  }

  getLastFetchParams() {
    return computed(() => this.lastFetchParams.value)
  }

  getFilters() {
    return computed(() => this.filters.value)
  }

  setIsRefreshing(isRefreshing: boolean) {
    this.isRefreshing.value = isRefreshing
  }

  setLastFetchParams(params: ServerFetchParams) {
    this.lastFetchParams.value = params
  }

  setFilters(filters: Partial<DataTableFilters>) {
    this.filters.value = { ...this.filters.value, ...filters }
  }

  setSearch(search: string) {
    this.filters.value.search = search
  }

  setFilter(key: string, value: unknown) {
    this.filters.value.filters[key] = value
  }

  clearFilters() {
    this.filters.value = {
      search: '',
      filters: {}
    }
  }
}
