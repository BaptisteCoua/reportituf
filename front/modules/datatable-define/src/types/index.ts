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

export interface DataTableHeader {
    key: string
    title: string
    sortable?: boolean
    width?: string
}

export interface DataTableBody {
    page: number
    itemsPerPage: number
    sorts: DataTableSort[]
    search: string
    filters: Record<string, unknown>
}

export interface FetchResponse<T> {
    items: T[]
    total: number
}

export type FetchFunction<T> = (body: DataTableBody) => Promise<FetchResponse<T>>

export interface DataTableOptions<T> {
    headers?: DataTableHeader[]
    itemsPerPage?: number
    itemKey?: string | ((item: T) => string | number)
    initialBody?: Partial<DataTableBody>
    persist?: boolean | 'session' | 'local'
}

export interface UseFetchOptions {
    watch?: boolean
}

export interface DataTableReturn<T> {
    body: import('vue').Ref<DataTableBody>
    items: import('vue').Ref<T[]>
    headers: import('vue').Ref<DataTableHeader[]>
    page: import('vue').ComputedRef<number>
    itemsPerPage: import('vue').ComputedRef<number>
    sorts: import('vue').ComputedRef<DataTableSort[]>
    search: import('vue').ComputedRef<string>
    filters: import('vue').ComputedRef<Record<string, unknown>>
    totalItems: import('vue').Ref<number>
    totalPages: import('vue').ComputedRef<number>
    pagination: import('vue').ComputedRef<DataTablePagination>
    selectedItems: import('vue').Ref<T[]>
    selectedIds: import('vue').ComputedRef<(string | number)[]>
    isLoading: import('vue').Ref<boolean>
    isAllSelected: import('vue').ComputedRef<boolean>
    isPageSelected: import('vue').ComputedRef<boolean>
    isIndeterminate: import('vue').ComputedRef<boolean>
    selectedCount: import('vue').ComputedRef<number>
    setPage: (page: number) => void
    setSorts: (sorts: DataTableSort[]) => void
    clearSorts: () => void
    setSearch: (search: string) => void
    clearSearch: () => void
    setFilters: (filters: Record<string, unknown>) => void
    clearFilters: () => void
    setHeaders: (headers: DataTableHeader[]) => void
    selectItems: (items: T[]) => void
    deselectItems: (items: T[]) => void
    toggleSelectAll: () => void
    toggleSelectPage: () => void
    clearSelection: () => void
    isSelected: (item: T) => boolean
    useFetch: (fetchFn: FetchFunction<T>, options?: UseFetchOptions) => { refresh: () => Promise<void> }
    reset: () => void
}
