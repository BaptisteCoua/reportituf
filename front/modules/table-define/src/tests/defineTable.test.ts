import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { defineTable } from '../defineTable'

interface User {
    id: number
    name: string
    email: string
}

const mockUsers: User[] = [
    { id: 1, name: 'Alice', email: 'alice@test.com' },
    { id: 2, name: 'Bob', email: 'bob@test.com' },
    { id: 3, name: 'Charlie', email: 'charlie@test.com' },
]

describe('defineTable', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    describe('creation', () => {
        it('cree une table avec les valeurs par defaut', () => {
            const useUsers = defineTable<[], User>(() => ({
                load: async () => ({ items: [], total: 0 }),
                watch: false,
            }))

            const table = useUsers()

            expect(table.items.value).toEqual([])
            expect(table.page.value).toBe(1)
            expect(table.itemsPerPage.value).toBe(10)
            expect(table.sorts.value).toEqual([])
            expect(table.search.value).toBe('')
            expect(table.filters.value).toEqual({})
            expect(table.total.value).toBe(0)
            expect(table.isLoading.value).toBe(false)
        })

        it('cree une table avec itemsPerPage custom', () => {
            const useUsers = defineTable<[], User>(() => ({
                load: async () => ({ items: [], total: 0 }),
                itemsPerPage: 25,
                watch: false,
            }))

            const table = useUsers()

            expect(table.itemsPerPage.value).toBe(25)
        })

        it('passe les arguments a la config', () => {
            const useUsers = defineTable<[string], User>(status => ({
                load: async () => ({
                    items: status === 'active' ? mockUsers : [],
                    total: status === 'active' ? 3 : 0,
                }),
                watch: false,
            }))

            const table = useUsers('active')

            expect(table.items.value).toEqual([])
        })
    })

    describe('refresh', () => {
        it('appelle load et met a jour items et total', async () => {
            const mockLoad = vi.fn(async () => ({
                items: mockUsers,
                total: 100,
            }))

            const useUsers = defineTable<[], User>(() => ({
                load: mockLoad,
                watch: false,
            }))

            const table = useUsers()
            await table.refresh()

            expect(mockLoad).toHaveBeenCalled()
            expect(table.items.value).toEqual(mockUsers)
            expect(table.total.value).toBe(100)
        })

        it('passe isLoading a true pendant le refresh', async () => {
            const useUsers = defineTable<[], User>(() => ({
                load: () =>
                    new Promise(resolve =>
                        setTimeout(() => resolve({ items: mockUsers, total: 3 }), 100)
                    ),
                watch: false,
            }))

            const table = useUsers()
            const promise = table.refresh()

            expect(table.isLoading.value).toBe(true)

            vi.advanceTimersByTime(100)
            await promise

            expect(table.isLoading.value).toBe(false)
        })

        it('passe les refs au load', async () => {
            const mockLoad = vi.fn(async () => ({ items: [], total: 0 }))

            const useUsers = defineTable<[], User>(() => ({
                load: mockLoad,
                watch: false,
            }))

            const table = useUsers()
            table.page.value = 2
            table.search.value = 'test'
            table.sorts.value = [{ key: 'name', order: 'asc' }]
            table.filters.value = { status: 'active' }

            await table.refresh()

            expect(mockLoad).toHaveBeenCalledWith({
                page: 2,
                itemsPerPage: 10,
                search: 'test',
                sorts: [{ key: 'name', order: 'asc' }],
                filters: { status: 'active' },
            })
        })
    })

    describe('watch auto', () => {
        it('refresh auto quand page change', async () => {
            const mockLoad = vi.fn(async () => ({ items: mockUsers, total: 100 }))

            const useUsers = defineTable<[], User>(() => ({
                load: mockLoad,
                watch: true,
            }))

            const table = useUsers()
            mockLoad.mockClear()

            table.page.value = 2
            await nextTick()

            expect(mockLoad).toHaveBeenCalledTimes(1)
        })

        it('refresh auto quand sorts change', async () => {
            const mockLoad = vi.fn(async () => ({ items: mockUsers, total: 100 }))

            const useUsers = defineTable<[], User>(() => ({
                load: mockLoad,
                watch: true,
            }))

            const table = useUsers()
            mockLoad.mockClear()

            table.sorts.value = [{ key: 'name', order: 'desc' }]
            await nextTick()

            expect(mockLoad).toHaveBeenCalledTimes(1)
        })

        it('refresh debounce quand search change', async () => {
            const mockLoad = vi.fn(async () => ({ items: mockUsers, total: 100 }))

            const useUsers = defineTable<[], User>(() => ({
                load: mockLoad,
                watch: true,
            }))

            const table = useUsers()
            mockLoad.mockClear()

            table.search.value = 'test'
            await nextTick()

            expect(mockLoad).not.toHaveBeenCalled()

            vi.advanceTimersByTime(300)
            await nextTick()

            expect(mockLoad).toHaveBeenCalledTimes(1)
            expect(table.page.value).toBe(1)
        })

        it('refresh debounce quand filters change', async () => {
            const mockLoad = vi.fn(async () => ({ items: mockUsers, total: 100 }))

            const useUsers = defineTable<[], User>(() => ({
                load: mockLoad,
                watch: true,
            }))

            const table = useUsers()
            await vi.advanceTimersByTimeAsync(0)
            mockLoad.mockClear()

            table.filters.value = { status: 'active' }
            await nextTick()

            expect(mockLoad).not.toHaveBeenCalled()

            await vi.advanceTimersByTimeAsync(300)

            expect(mockLoad).toHaveBeenCalledTimes(1)
            expect(table.page.value).toBe(1)
        })

        it('pas de watch si watch: false', async () => {
            const mockLoad = vi.fn(async () => ({ items: mockUsers, total: 100 }))

            const useUsers = defineTable<[], User>(() => ({
                load: mockLoad,
                watch: false,
            }))

            const table = useUsers()
            mockLoad.mockClear()

            table.page.value = 2
            await nextTick()

            expect(mockLoad).not.toHaveBeenCalled()
        })
    })

    describe('reset', () => {
        it('reset reinitialise tout', async () => {
            const useUsers = defineTable<[], User>(() => ({
                load: async () => ({ items: mockUsers, total: 100 }),
                itemsPerPage: 20,
                watch: false,
            }))

            const table = useUsers()
            await table.refresh()
            table.page.value = 3
            table.search.value = 'test'

            table.reset()

            expect(table.items.value).toEqual([])
            expect(table.total.value).toBe(0)
            expect(table.page.value).toBe(1)
            expect(table.itemsPerPage.value).toBe(20)
            expect(table.search.value).toBe('')
        })
    })
})
