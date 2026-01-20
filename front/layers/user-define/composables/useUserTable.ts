import { computed } from 'vue'
import { defineDataTable } from '~/modules/datatable-define/src'
import type { DataTableHeader } from '~/modules/datatable-define/src/types'
import type { User } from '../types'
import { UserService } from '../services/UserService'

const headers: DataTableHeader[] = [
    { key: 'image', title: '', sortable: false, width: '60px' },
    { key: 'firstName', title: 'Prénom', sortable: true },
    { key: 'lastName', title: 'Nom', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'phone', title: 'Téléphone', sortable: false },
    { key: 'age', title: 'Âge', sortable: true },
    { key: 'gender', title: 'Genre', sortable: true },
    { key: 'company.name', title: 'Entreprise', sortable: false },
]

export function useUserTable() {
    const table = defineDataTable<User>('user-define-table', {
        headers,
        itemsPerPage: 10,
    })

    const { refresh } = table.useFetch(async (body) => {
        const sortBy =
            body.sorts.length > 0
                ? body.sorts[0].key
                : undefined
        const order =
            body.sorts.length > 0
                ? body.sorts[0].order
                : undefined

        const response = await UserService.getUsers({
            limit: body.itemsPerPage,
            skip: (body.page - 1) * body.itemsPerPage,
            search: body.search,
            sortBy,
            order,
            filters: body.filters,
        })

        return {
            items: response.users,
            total: response.total,
        }
    })

    const sort = computed(() => {
        if (table.sorts.value.length === 0) return null
        return table.sorts.value[0]
    })

    const toggleSort = (key: string) => {
        const currentSort = table.sorts.value.find((s) => s.key === key)

        if (!currentSort) {
            table.setSorts([{ key, order: 'asc' }])
        } else if (currentSort.order === 'asc') {
            table.setSorts([{ key, order: 'desc' }])
        } else {
            table.clearSorts()
        }
    }

    const setFilter = (key: string, value: unknown) => {
        table.setFilters({ ...table.filters.value, [key]: value })
    }

    return {
        items: table.items,
        headers: table.headers,
        pagination: table.pagination,
        sort,
        isLoading: table.isLoading,
        search: table.search,
        filters: table.filters,
        fetchItems: refresh,
        setPage: table.setPage,
        setItemsPerPage: (value: number) => {
            table.body.value.itemsPerPage = value
        },
        toggleSort,
        setSearch: table.setSearch,
        setFilter,
        clearFilters: table.clearFilters,
    }
}
