export interface DataTableHeader {
  key: string
  title: string
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
  width?: string | number
  fixed?: boolean
}

export interface DataTableSort {
  key: string
  order: 'asc' | 'desc'
}

export interface DataTablePagination {
  page: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export interface DataTableOptions<T = unknown> {
  headers?: DataTableHeader[]
  items?: T[]
  itemsPerPage?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  multiSort?: boolean
  itemKey?: string | ((item: T) => string | number)
}

export interface ServerFetchParams {
  page: number
  itemsPerPage: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, unknown>
}

export interface ServerFetchResponse<T = unknown> {
  items: T[]
  total: number
}

export interface DataTableFilters {
  search: string
  filters: Record<string, unknown>
}

export type PayloadBuilderFunction = (params: ServerFetchParams) => unknown

export interface ServerDataTableOptions<T = unknown> extends DataTableOptions<T> {
  fetchFunction: (payload: unknown) => Promise<ServerFetchResponse<T>>
  payloadBuilder?: PayloadBuilderFunction
  autoFetch?: boolean
  debounceMs?: number
}
