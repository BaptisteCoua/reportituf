import { defineDataTable } from '../../../modules/datatable-define/src'
import type { User } from '../types'
import { UserService } from '../services/UserService'

const headers = [
    { key: 'id', title: 'ID', sortable: true, width: '80px' },
    { key: 'avatar', title: 'Avatar', sortable: false, width: '80px' },
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'role', title: 'Role', sortable: true, width: '120px' },
    { key: 'creationAt', title: 'Created', sortable: true, width: '150px' },
    { key: 'actions', title: 'Actions', sortable: false, width: '100px' },
]

export function useUserTable() {
    const table = defineDataTable<User>('users-table', {
        headers,
        itemsPerPage: 10,
        itemKey: 'id',
    })

    const { refresh } = table.useFetch(async (body) => {
        const allUsers = await UserService.getAll()

        let filtered = [...allUsers]

        if (body.search) {
            const search = body.search.toLowerCase()
            filtered = filtered.filter(
                (user) =>
                    user.name.toLowerCase().includes(search) ||
                    user.email.toLowerCase().includes(search)
            )
        }

        if (body.filters?.role) {
            filtered = filtered.filter((user) => user.role === body.filters.role)
        }

        if (body.sorts.length > 0) {
            const sortKey = body.sorts[0].key as keyof User
            const sortOrder = body.sorts[0].order

            filtered.sort((a, b) => {
                const aVal = a[sortKey]
                const bVal = b[sortKey]
                const comparison = String(aVal).localeCompare(String(bVal))
                return sortOrder === 'desc' ? -comparison : comparison
            })
        }

        const start = (body.page - 1) * body.itemsPerPage
        const end = start + body.itemsPerPage
        const paginatedItems = filtered.slice(start, end)

        return {
            items: paginatedItems,
            total: filtered.length,
        }
    })

    return {
        ...table,
        refresh,
    }
}
