import { defineServerDataTable } from '../../../modules/datatable-define/src/defineServerDataTable'
import type { User } from '../types'
import { UserService } from '../services/UserService'

const headers = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'avatar', label: 'Avatar', sortable: false, width: '80px' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true, width: '120px' },
  { key: 'creationAt', label: 'Created', sortable: true, width: '150px' },
  { key: 'actions', label: 'Actions', sortable: false, width: '100px' }
]

export const useUserTable = defineServerDataTable<User>('users-table', {
  headers,
  itemsPerPage: 10,
  itemKey: 'id',
  debounceMs: 300,
  async fetchFn(payload) {
    const allUsers = await UserService.getAll()

    let filtered = [...allUsers]

    const params = payload as {
      page: number
      per_page: number
      search?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
      filters?: { role?: string }
    }

    if (params.search) {
      const search = params.search.toLowerCase()
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      )
    }

    if (params.filters?.role) {
      filtered = filtered.filter(user => user.role === params.filters?.role)
    }

    if (params.sort_by) {
      filtered.sort((a, b) => {
        const aVal = a[params.sort_by as keyof User]
        const bVal = b[params.sort_by as keyof User]
        const comparison = String(aVal).localeCompare(String(bVal))
        return params.sort_order === 'desc' ? -comparison : comparison
      })
    }

    const start = (params.page - 1) * params.per_page
    const end = start + params.per_page
    const paginatedItems = filtered.slice(start, end)

    return {
      items: paginatedItems,
      total: filtered.length
    }
  }
})
