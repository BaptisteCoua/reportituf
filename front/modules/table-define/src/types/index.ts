import type { Ref } from 'vue'

export interface TableSort {
    key: string
    order: 'asc' | 'desc'
}

export interface TableBody {
    page: number
    itemsPerPage: number
    sorts: TableSort[]
    search: string
    filters: Record<string, unknown>
}

export interface TableConfig<T> {
    load: (body: TableBody) => Promise<{ items: T[]; total: number }>
    itemsPerPage?: number
    watch?: boolean
}

export interface TableReturn<T> {
    items: Ref<T[]>
    total: Ref<number>
    isLoading: Ref<boolean>
    page: Ref<number>
    itemsPerPage: Ref<number>
    sorts: Ref<TableSort[]>
    search: Ref<string>
    filters: Ref<Record<string, unknown>>
    refresh: () => Promise<void>
    reset: () => void
}
