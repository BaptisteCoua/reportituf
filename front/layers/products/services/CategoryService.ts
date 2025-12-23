import type { Category } from '../types'

const BASE_URL = 'https://api.escuelajs.co/api/v1'

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const response = await fetch(`${BASE_URL}/categories`)
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  },

  async getById(id: number): Promise<Category> {
    const response = await fetch(`${BASE_URL}/categories/${id}`)
    if (!response.ok) throw new Error('Failed to fetch category')
    return response.json()
  }
}
