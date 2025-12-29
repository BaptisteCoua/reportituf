import type { UsersResponse } from '../types'

const BASE_URL = 'https://dummyjson.com'

export const UserService = {
  async getUsers(params: {
    limit?: number
    skip?: number
    search?: string
    sortBy?: string
    order?: 'asc' | 'desc'
    filters?: Record<string, unknown>
  }): Promise<UsersResponse> {
    const { limit = 10, skip = 0, search, sortBy, order, filters } = params

    let url = `${BASE_URL}/users`
    const queryParams = new URLSearchParams()

    if (search) {
      url = `${BASE_URL}/users/search`
      queryParams.append('q', search)
    }

    queryParams.append('limit', String(limit))
    queryParams.append('skip', String(skip))

    if (sortBy) {
      queryParams.append('sortBy', sortBy)
      queryParams.append('order', order || 'asc')
    }

    if (filters?.gender) {
      url = `${BASE_URL}/users/filter`
      queryParams.append('key', 'gender')
      queryParams.append('value', String(filters.gender))
    }

    const response = await fetch(`${url}?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    return response.json()
  }
}
