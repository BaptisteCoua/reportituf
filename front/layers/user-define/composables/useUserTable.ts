import { defineServerDataTable } from '~/modules/datatable-define/src'
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
  { key: 'company.name', title: 'Entreprise', sortable: false }
]

export const useUserTable = defineServerDataTable<User>('user-define-table', {
  headers,
  itemsPerPage: 10,
  autoFetch: false,
  fetchFunction: async (payload) => {
    const params = payload as {
      page: number
      per_page: number
      sort_by?: string
      sort_order?: 'asc' | 'desc'
      search?: string
      filters?: Record<string, unknown>
    }

    const response = await UserService.getUsers({
      limit: params.per_page,
      skip: (params.page - 1) * params.per_page,
      search: params.search,
      sortBy: params.sort_by,
      order: params.sort_order,
      filters: params.filters
    })

    return {
      items: response.users,
      total: response.total
    }
  }
})
