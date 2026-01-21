import { computed } from 'vue'
import { defineTable } from '~/modules/table-define/src'
import type { User } from '../types'
import { UserService } from '../services/UserService'

export const useUserTable = defineTable<[], User>(() => ({
    load: async ({ page, itemsPerPage, search, sorts, filters }) => {
        const sortBy = sorts.length > 0 ? sorts[0].key : undefined
        const order = sorts.length > 0 ? sorts[0].order : undefined

        const response = await UserService.getUsers({
            limit: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
            search,
            sortBy,
            order,
            filters,
        })

        return {
            items: response.users,
            total: response.total,
        }
    },
    itemsPerPage: 10,
}))
