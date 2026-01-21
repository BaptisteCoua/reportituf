import { ref, watch, type Ref } from 'vue'

export interface TableSort {
    key: string
    order: 'asc' | 'desc'
}

interface TableConfig<T> {
    load: (body: {
        page: number
        itemsPerPage: number
        sorts: TableSort[]
        search: string
        filters: Record<string, unknown>
    }) => Promise<{ items: T[]; total: number }>
    itemsPerPage?: number
    watch?: boolean
}

interface TableReturn<T> {
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

export const defineTable = <TArgs extends unknown[], T>(
    callback: (...args: TArgs) => TableConfig<T>
) => {
    return (...args: TArgs): TableReturn<T> => {
        const config = callback(...args)
        const enableWatch = config.watch !== false

        const items = ref<T[]>([]) as Ref<T[]>
        const total = ref(0)
        const isLoading = ref(false)

        const page = ref(1)
        const itemsPerPage = ref(config.itemsPerPage ?? 10)
        const sorts = ref<TableSort[]>([]) as Ref<TableSort[]>
        const search = ref('')
        const filters = ref<Record<string, unknown>>({})

        let debounceTimer: ReturnType<typeof setTimeout> | null = null

        const refresh = async () => {
            isLoading.value = true
            try {
                const result = await config.load({
                    page: page.value,
                    itemsPerPage: itemsPerPage.value,
                    sorts: sorts.value,
                    search: search.value,
                    filters: filters.value,
                })
                items.value = result.items
                total.value = result.total
            } finally {
                isLoading.value = false
            }
        }

        const reset = () => {
            items.value = []
            total.value = 0
            page.value = 1
            itemsPerPage.value = config.itemsPerPage ?? 10
            sorts.value = []
            search.value = ''
            filters.value = {}
        }

        if (enableWatch) {
            watch([page, itemsPerPage, sorts], () => refresh(), { deep: true })

            watch([search, filters], () => {
                if (debounceTimer) clearTimeout(debounceTimer)
                debounceTimer = setTimeout(() => {
                    page.value = 1
                    refresh()
                }, 300)
            }, { deep: true })
        }

        return {
            items,
            total,
            isLoading,
            page,
            itemsPerPage,
            sorts,
            search,
            filters,
            refresh,
            reset,
        }
    }
}
