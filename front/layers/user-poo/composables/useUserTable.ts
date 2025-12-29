import { ServerDataTable } from '~/modules/datatable-v2/src'
import type { DataTableHeader } from '~/modules/datatable-v2/src'
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

export function useUserTable() {
  const table = new ServerDataTable<User>({
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
    },
    onError: (error) => {
      console.error('Erreur lors du chargement des utilisateurs:', error)
    }
  })

  return {
    items: table.getItems(),
    headers: table.getHeaders(),
    pagination: table.getPagination(),
    sort: table.getSort(),
    isLoading: table.getIsLoading(),
    search: table.getSearch(),
    filters: table.getFilters(),
    selectedItems: table.getSelectedItems(),
    selectedCount: table.getSelectedCount(),
    isAllSelected: table.isAllSelected(),
    isIndeterminate: table.isIndeterminate(),

    fetchItems: table.fetchItems.bind(table),
    setPage: table.setPage.bind(table),
    setItemsPerPage: table.setItemsPerPage.bind(table),
    toggleSort: table.toggleSort.bind(table),
    setSearch: table.setSearch.bind(table),
    setFilter: table.setFilter.bind(table),
    clearFilters: table.clearFilters.bind(table),
    selectItem: table.selectItem.bind(table),
    selectAll: table.selectAll.bind(table),
    clearSelection: table.clearSelection.bind(table),
    refresh: table.refresh.bind(table),
    reset: table.reset.bind(table)
  }
}
