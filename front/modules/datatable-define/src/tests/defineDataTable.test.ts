import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { defineDataTable } from '../defineDataTable'
import { clearDataTableRegistry } from '../store/registry'

interface User {
    id: number
    name: string
    email: string
    age: number
}

const mockUsers: User[] = [
    { id: 1, name: 'Alice', email: 'alice@test.com', age: 25 },
    { id: 2, name: 'Bob', email: 'bob@test.com', age: 30 },
    { id: 3, name: 'Charlie', email: 'charlie@test.com', age: 35 },
]

describe('defineDataTable', () => {
    beforeEach(() => {
        clearDataTableRegistry()
    })

    describe('creation et options', () => {
        it('cree une table avec les options par defaut', () => {
            const table = defineDataTable<User>('users')

            expect(table.items.value).toEqual([])
            expect(table.body.value.page).toBe(1)
            expect(table.body.value.itemsPerPage).toBe(10)
            expect(table.body.value.sorts).toEqual([])
            expect(table.body.value.search).toBe('')
            expect(table.body.value.filters).toEqual({})
        })

        it('cree une table avec itemsPerPage custom', () => {
            const table = defineDataTable<User>('customPerPage', {
                itemsPerPage: 25,
            })

            expect(table.body.value.itemsPerPage).toBe(25)
        })

        it('cree une table avec initialBody', () => {
            const table = defineDataTable<User>('withInitialBody', {
                initialBody: {
                    page: 2,
                    search: 'test',
                    filters: { status: 'active' },
                },
            })

            expect(table.body.value.page).toBe(2)
            expect(table.body.value.search).toBe('test')
            expect(table.body.value.filters).toEqual({ status: 'active' })
        })

        it('retourne la meme instance pour le meme id', () => {
            const table1 = defineDataTable<User>('sameId')
            const table2 = defineDataTable<User>('sameId')

            table1.items.value = mockUsers

            expect(table2.items.value).toHaveLength(3)
        })
    })

    describe('body reactif', () => {
        it('page computed est synchronise avec body', () => {
            const table = defineDataTable<User>('bodyPage')

            table.body.value.page = 3

            expect(table.page.value).toBe(3)
        })

        it('sorts computed est synchronise avec body', () => {
            const table = defineDataTable<User>('bodySorts')

            table.body.value.sorts = [{ key: 'name', order: 'asc' }]

            expect(table.sorts.value).toEqual([{ key: 'name', order: 'asc' }])
        })

        it('search computed est synchronise avec body', () => {
            const table = defineDataTable<User>('bodySearch')

            table.body.value.search = 'test'

            expect(table.search.value).toBe('test')
        })

        it('filters computed est synchronise avec body', () => {
            const table = defineDataTable<User>('bodyFilters')

            table.body.value.filters = { status: 'active' }

            expect(table.filters.value).toEqual({ status: 'active' })
        })
    })

    describe('actions', () => {
        it('setPage modifie la page', () => {
            const table = defineDataTable<User>('setPage')

            table.setPage(3)

            expect(table.body.value.page).toBe(3)
        })

        it('setPage limite la page au max', () => {
            const table = defineDataTable<User>('setPageMax')
            table.totalItems.value = 50
            table.body.value.itemsPerPage = 10

            table.setPage(10)

            expect(table.body.value.page).toBe(5)
        })

        it('setSorts modifie les tris', () => {
            const table = defineDataTable<User>('setSorts')

            table.setSorts([{ key: 'name', order: 'desc' }])

            expect(table.body.value.sorts).toEqual([{ key: 'name', order: 'desc' }])
        })

        it('clearSorts vide les tris', () => {
            const table = defineDataTable<User>('clearSorts')
            table.body.value.sorts = [{ key: 'name', order: 'asc' }]

            table.clearSorts()

            expect(table.body.value.sorts).toEqual([])
        })

        it('setSearch modifie la recherche et reset la page', () => {
            const table = defineDataTable<User>('setSearch')
            table.body.value.page = 3

            table.setSearch('test')

            expect(table.body.value.search).toBe('test')
            expect(table.body.value.page).toBe(1)
        })

        it('clearSearch vide la recherche et reset la page', () => {
            const table = defineDataTable<User>('clearSearch')
            table.body.value.search = 'test'
            table.body.value.page = 3

            table.clearSearch()

            expect(table.body.value.search).toBe('')
            expect(table.body.value.page).toBe(1)
        })

        it('setFilters modifie les filtres et reset la page', () => {
            const table = defineDataTable<User>('setFilters')
            table.body.value.page = 3

            table.setFilters({ status: 'active' })

            expect(table.body.value.filters).toEqual({ status: 'active' })
            expect(table.body.value.page).toBe(1)
        })

        it('clearFilters vide les filtres et reset la page', () => {
            const table = defineDataTable<User>('clearFilters')
            table.body.value.filters = { status: 'active' }
            table.body.value.page = 3

            table.clearFilters()

            expect(table.body.value.filters).toEqual({})
            expect(table.body.value.page).toBe(1)
        })
    })

    describe('selection', () => {
        it('selectItems ajoute des items', () => {
            const table = defineDataTable<User>('selectItems')
            table.items.value = mockUsers

            table.selectItems([mockUsers[0]])

            expect(table.selectedItems.value).toHaveLength(1)
            expect(table.selectedItems.value[0].id).toBe(1)
        })

        it('selectItems evite les doublons', () => {
            const table = defineDataTable<User>('selectDuplicates')
            table.items.value = mockUsers

            table.selectItems([mockUsers[0]])
            table.selectItems([mockUsers[0]])

            expect(table.selectedItems.value).toHaveLength(1)
        })

        it('deselectItems retire des items', () => {
            const table = defineDataTable<User>('deselectItems')
            table.items.value = mockUsers
            table.selectItems([mockUsers[0], mockUsers[1]])

            table.deselectItems([mockUsers[0]])

            expect(table.selectedItems.value).toHaveLength(1)
            expect(table.selectedItems.value[0].id).toBe(2)
        })

        it('toggleSelectAll selectionne/deselectionne tout', () => {
            const table = defineDataTable<User>('toggleAll')
            table.items.value = mockUsers

            table.toggleSelectAll()

            expect(table.selectedItems.value).toHaveLength(3)
            expect(table.isAllSelected.value).toBe(true)

            table.toggleSelectAll()

            expect(table.selectedItems.value).toHaveLength(0)
            expect(table.isAllSelected.value).toBe(false)
        })

        it('toggleSelectPage selectionne/deselectionne la page', () => {
            const table = defineDataTable<User>('togglePage')
            table.items.value = mockUsers

            table.toggleSelectPage()

            expect(table.isPageSelected.value).toBe(true)

            table.toggleSelectPage()

            expect(table.isPageSelected.value).toBe(false)
        })

        it('clearSelection vide la selection', () => {
            const table = defineDataTable<User>('clearSelection')
            table.items.value = mockUsers
            table.toggleSelectAll()

            table.clearSelection()

            expect(table.selectedItems.value).toHaveLength(0)
        })

        it('isSelected verifie si un item est selectionne', () => {
            const table = defineDataTable<User>('isSelected')
            table.items.value = mockUsers
            table.selectItems([mockUsers[0]])

            expect(table.isSelected(mockUsers[0])).toBe(true)
            expect(table.isSelected(mockUsers[1])).toBe(false)
        })

        it('isIndeterminate est true si selection partielle', () => {
            const table = defineDataTable<User>('isIndeterminate')
            table.items.value = mockUsers
            table.selectItems([mockUsers[0]])

            expect(table.isIndeterminate.value).toBe(true)
            expect(table.isAllSelected.value).toBe(false)
        })

        it('selectedCount retourne le nombre selectionne', () => {
            const table = defineDataTable<User>('selectedCount')
            table.items.value = mockUsers
            table.selectItems([mockUsers[0], mockUsers[1]])

            expect(table.selectedCount.value).toBe(2)
        })

        it('selectedIds retourne les ids selectionnes', () => {
            const table = defineDataTable<User>('selectedIds')
            table.items.value = mockUsers
            table.selectItems([mockUsers[0], mockUsers[1]])

            expect(table.selectedIds.value).toEqual([1, 2])
        })
    })

    describe('useFetch', () => {
        it('appelle fetchFn et met a jour items et total', async () => {
            const table = defineDataTable<User>('fetchTest')

            const mockFetch = vi.fn(async () => ({
                items: mockUsers,
                total: 100,
            }))

            const { refresh } = table.useFetch(mockFetch, { watch: false })

            await refresh()

            expect(mockFetch).toHaveBeenCalledWith(table.body.value)
            expect(table.items.value).toEqual(mockUsers)
            expect(table.totalItems.value).toBe(100)
        })

        it('passe isLoading a true pendant le fetch', async () => {
            const table = defineDataTable<User>('loadingTest')

            const mockFetch = vi.fn<[], Promise<{ items: User[]; total: number }>>(
                () =>
                    new Promise((resolve) =>
                        setTimeout(() => resolve({ items: mockUsers, total: 3 }), 50)
                    )
            )

            const { refresh } = table.useFetch(mockFetch, { watch: false })

            const promise = refresh()
            await nextTick()

            expect(table.isLoading.value).toBe(true)

            await promise

            expect(table.isLoading.value).toBe(false)
        })

        it('retourne la meme instance si deja setup', () => {
            const table = defineDataTable<User>('sameSetup')

            const mockFetch1 = vi.fn(async () => ({ items: [], total: 0 }))
            const mockFetch2 = vi.fn(async () => ({ items: [], total: 0 }))

            const result1 = table.useFetch(mockFetch1, { watch: false })
            const result2 = table.useFetch(mockFetch2, { watch: false })

            expect(result1.refresh).toBe(result2.refresh)
        })

        it('ignore les erreurs AbortError', async () => {
            const table = defineDataTable<User>('abortTest')

            const mockFetch = vi.fn(async () => {
                const error = new Error('Aborted')
                error.name = 'AbortError'
                throw error
            })

            const { refresh } = table.useFetch(mockFetch, { watch: false })

            await expect(refresh()).resolves.toBeUndefined()
        })

        it('propage les autres erreurs', async () => {
            const table = defineDataTable<User>('errorTest')

            const mockFetch = vi.fn(async () => {
                throw new Error('Network error')
            })

            const { refresh } = table.useFetch(mockFetch, { watch: false })

            await expect(refresh()).rejects.toThrow('Network error')
        })
    })

    describe('reset', () => {
        it('reset reinitialise tout', () => {
            const table = defineDataTable<User>('resetTest', {
                itemsPerPage: 20,
                initialBody: {
                    search: 'initial',
                },
            })

            table.items.value = mockUsers
            table.totalItems.value = 100
            table.body.value.page = 3
            table.body.value.search = 'changed'
            table.selectItems([mockUsers[0]])

            table.reset()

            expect(table.items.value).toEqual([])
            expect(table.totalItems.value).toBe(0)
            expect(table.body.value.page).toBe(1)
            expect(table.body.value.itemsPerPage).toBe(20)
            expect(table.body.value.search).toBe('initial')
            expect(table.selectedItems.value).toEqual([])
        })
    })

    describe('pagination computed', () => {
        it('totalPages calcule correctement le nombre de pages', () => {
            const table = defineDataTable<User>('totalPages')
            table.totalItems.value = 100
            table.body.value.itemsPerPage = 10

            expect(table.totalPages.value).toBe(10)

            table.body.value.itemsPerPage = 25

            expect(table.totalPages.value).toBe(4)
        })

        it('pagination retourne un objet complet', () => {
            const table = defineDataTable<User>('pagination')
            table.totalItems.value = 50
            table.body.value.page = 2
            table.body.value.itemsPerPage = 10

            expect(table.pagination.value).toEqual({
                page: 2,
                itemsPerPage: 10,
                totalItems: 50,
                totalPages: 5,
            })
        })
    })
})
