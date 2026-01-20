import { ref, watch, type Ref } from 'vue'
import type { DataTableBody, DataTableHeader, DataTableOptions } from '../types'

interface DataTableStore<T> {
    body: Ref<DataTableBody>
    items: Ref<T[]>
    headers: Ref<DataTableHeader[]>
    totalItems: Ref<number>
    selectedItems: Ref<T[]>
    isLoading: Ref<boolean>
    _fetchSetup: {
        doFetch: () => Promise<void>
        cleanup: () => void
    } | null
}

const registry = new Map<string, DataTableStore<unknown>>()

const STORAGE_PREFIX = 'datatable:'

function getFromStorage(id: string, persist: 'session' | 'local'): Partial<DataTableBody> | null {
    if (typeof window === 'undefined') return null

    const storage = persist === 'local' ? localStorage : sessionStorage
    const key = STORAGE_PREFIX + id

    try {
        const stored = storage.getItem(key)
        if (!stored) return null
        return JSON.parse(stored)
    } catch {
        return null
    }
}

function saveToStorage(id: string, body: DataTableBody, persist: 'session' | 'local'): void {
    if (typeof window === 'undefined') return

    const storage = persist === 'local' ? localStorage : sessionStorage
    const key = STORAGE_PREFIX + id

    try {
        storage.setItem(key, JSON.stringify(body))
    } catch {
        // Silent fail
    }
}

function createTableStore<T>(id: string, options: DataTableOptions<T>): DataTableStore<T> {
    const defaultBody: DataTableBody = {
        page: 1,
        itemsPerPage: options.itemsPerPage || 10,
        sorts: [],
        search: '',
        filters: {},
    }

    const initialBody = { ...defaultBody, ...options.initialBody }

    if (options.persist && typeof options.persist === 'string') {
        const stored = getFromStorage(id, options.persist)
        if (stored) {
            Object.assign(initialBody, stored)
        }
    }

    const body = ref(initialBody) as Ref<DataTableBody>
    const items: Ref<T[]> = ref([]) as Ref<T[]>
    const headers: Ref<DataTableHeader[]> = ref(options.headers || [])
    const totalItems = ref(0)
    const selectedItems: Ref<T[]> = ref([]) as Ref<T[]>
    const isLoading = ref(false)

    if (options.persist && typeof options.persist === 'string') {
        watch(
            body,
            (newBody) => {
                saveToStorage(id, newBody, options.persist as 'session' | 'local')
            },
            { deep: true }
        )
    }

    return {
        body,
        items,
        headers,
        totalItems,
        selectedItems,
        isLoading,
        _fetchSetup: null,
    }
}

export function registerDataTable<T>(
    id: string,
    options: DataTableOptions<T>
): DataTableStore<T> {
    if (registry.has(id)) {
        return registry.get(id) as DataTableStore<T>
    }

    const store = createTableStore(id, options)
    registry.set(id, store as DataTableStore<unknown>)
    return store
}

export function clearDataTableRegistry(): void {
    registry.clear()
}

export function hasDataTable(id: string): boolean {
    return registry.has(id)
}
