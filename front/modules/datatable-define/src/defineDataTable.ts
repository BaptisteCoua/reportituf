import { computed, watch, onScopeDispose } from 'vue'
import { registerDataTable } from './store/registry'
import type {
    DataTableOptions,
    DataTableReturn,
    FetchFunction,
    UseFetchOptions,
} from './types'

function watchDebounced(
    source: () => unknown,
    callback: () => void,
    delay: number
): () => void {
    let timer: ReturnType<typeof setTimeout> | null = null

    const stop = watch(
        source,
        () => {
            if (timer) clearTimeout(timer)
            timer = setTimeout(callback, delay)
        },
        { deep: true }
    )

    return () => {
        if (timer) clearTimeout(timer)
        stop()
    }
}

export function defineDataTable<T = unknown>(
    id: string,
    options: DataTableOptions<T> = {}
): DataTableReturn<T> {
    const itemKey = options.itemKey || 'id'
    const store = registerDataTable(id, options)

    const getItemId = (item: T): string | number => {
        if (typeof itemKey === 'function') {
            return itemKey(item)
        }
        return (item as Record<string, unknown>)[itemKey] as string | number
    }

    const page = computed(() => store.body.value.page)
    const itemsPerPage = computed(() => store.body.value.itemsPerPage)
    const sorts = computed(() => store.body.value.sorts)
    const search = computed(() => store.body.value.search)
    const filters = computed(() => store.body.value.filters)

    const totalPages = computed(() => {
        return Math.ceil(store.totalItems.value / store.body.value.itemsPerPage) || 1
    })

    const pagination = computed(() => ({
        page: store.body.value.page,
        itemsPerPage: store.body.value.itemsPerPage,
        totalItems: store.totalItems.value,
        totalPages: totalPages.value,
    }))

    const selectedIds = computed(() => {
        return store.selectedItems.value.map((item) => getItemId(item))
    })

    const isAllSelected = computed(() => {
        return (
            store.items.value.length > 0 &&
            store.selectedItems.value.length === store.items.value.length
        )
    })

    const isPageSelected = computed(() => {
        const ids = new Set(selectedIds.value)
        return (
            store.items.value.length > 0 &&
            store.items.value.every((item) => ids.has(getItemId(item)))
        )
    })

    const isIndeterminate = computed(() => {
        return (
            store.selectedItems.value.length > 0 &&
            store.selectedItems.value.length < store.items.value.length
        )
    })

    const selectedCount = computed(() => store.selectedItems.value.length)

    const setPage = (newPage: number) => {
        const maxPage = totalPages.value
        store.body.value.page = Math.max(1, Math.min(newPage, maxPage))
    }

    const setSorts = (newSorts: typeof store.body.value.sorts) => {
        store.body.value.sorts = newSorts
    }

    const clearSorts = () => {
        store.body.value.sorts = []
    }

    const setSearch = (newSearch: string) => {
        store.body.value.search = newSearch
        store.body.value.page = 1
    }

    const clearSearch = () => {
        store.body.value.search = ''
        store.body.value.page = 1
    }

    const setFilters = (newFilters: Record<string, unknown>) => {
        store.body.value.filters = newFilters
        store.body.value.page = 1
    }

    const clearFilters = () => {
        store.body.value.filters = {}
        store.body.value.page = 1
    }

    const setHeaders = (newHeaders: typeof store.headers.value) => {
        store.headers.value = newHeaders
    }

    const selectItems = (itemsToSelect: T[]) => {
        const ids = new Set(selectedIds.value)
        const newItems = itemsToSelect.filter((item) => !ids.has(getItemId(item)))
        store.selectedItems.value = [...store.selectedItems.value, ...newItems]
    }

    const deselectItems = (itemsToDeselect: T[]) => {
        const idsToRemove = new Set(itemsToDeselect.map((item) => getItemId(item)))
        store.selectedItems.value = store.selectedItems.value.filter(
            (item) => !idsToRemove.has(getItemId(item))
        )
    }

    const toggleSelectAll = () => {
        if (isAllSelected.value) {
            store.selectedItems.value = []
        } else {
            store.selectedItems.value = [...store.items.value]
        }
    }

    const toggleSelectPage = () => {
        if (isPageSelected.value) {
            deselectItems(store.items.value)
        } else {
            selectItems(store.items.value)
        }
    }

    const clearSelection = () => {
        store.selectedItems.value = []
    }

    const isSelected = (item: T): boolean => {
        return selectedIds.value.includes(getItemId(item))
    }

    const useFetch = (
        fetchFn: FetchFunction<T>,
        options: UseFetchOptions = {}
    ): { refresh: () => Promise<void> } => {
        const enableWatch = options.watch !== false

        if (store._fetchSetup) {
            return { refresh: store._fetchSetup.doFetch }
        }

        let abortController: AbortController | null = null
        let isFetching = false

        const doFetch = async () => {
            if (isFetching) return

            if (abortController) {
                abortController.abort()
            }

            abortController = new AbortController()
            isFetching = true
            store.isLoading.value = true

            try {
                const result = await fetchFn(store.body.value)
                store.items.value = result.items
                store.totalItems.value = result.total
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    throw error
                }
            } finally {
                store.isLoading.value = false
                isFetching = false
                abortController = null
            }
        }

        const watchers: Array<() => void> = []

        if (enableWatch) {
            const stopPageWatch = watch(
                () => [store.body.value.page, store.body.value.sorts],
                () => doFetch(),
                { deep: true }
            )
            watchers.push(stopPageWatch)

            const stopSearchWatch = watchDebounced(
                () => [store.body.value.search, store.body.value.filters],
                () => doFetch(),
                300
            )
            watchers.push(stopSearchWatch)
        }

        const cleanup = () => {
            watchers.forEach((stop) => stop())
            if (abortController) {
                abortController.abort()
            }
        }

        onScopeDispose(cleanup)

        store._fetchSetup = { doFetch, cleanup }

        return { refresh: doFetch }
    }

    const reset = () => {
        store.items.value = []
        store.selectedItems.value = []
        store.totalItems.value = 0
        store.body.value = {
            page: 1,
            itemsPerPage: options.itemsPerPage || 10,
            sorts: [],
            search: '',
            filters: {},
            ...options.initialBody,
        }
    }

    return {
        body: store.body,
        items: store.items,
        headers: store.headers,
        page,
        itemsPerPage,
        sorts,
        search,
        filters,
        totalItems: store.totalItems,
        totalPages,
        pagination,
        selectedItems: store.selectedItems,
        selectedIds,
        isLoading: store.isLoading,
        isAllSelected,
        isPageSelected,
        isIndeterminate,
        selectedCount,
        setPage,
        setSorts,
        clearSorts,
        setSearch,
        clearSearch,
        setFilters,
        clearFilters,
        setHeaders,
        selectItems,
        deselectItems,
        toggleSelectAll,
        toggleSelectPage,
        clearSelection,
        isSelected,
        useFetch,
        reset,
    }
}
