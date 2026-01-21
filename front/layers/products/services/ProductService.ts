import type { Product, CreateProductPayload, UpdateProductPayload } from '../types'

const BASE_URL = 'https://api.escuelajs.co/api/v1'

export const ProductService = {
  async getAll(): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/products`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },

  async getById(id: number): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    return response.json()
  },

  async getByCategory(categoryId: number): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/categories/${categoryId}/products`)
    if (!response.ok) throw new Error('Failed to fetch products by category')
    return response.json()
  },

  async getPaginated(offset: number, limit: number): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/products?offset=${offset}&limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },

  async create(payload: CreateProductPayload): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) throw new Error('Failed to create product')
    return response.json()
  },

  async update(payload: UpdateProductPayload): Promise<Product> {
    const { id, ...data } = payload
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update product')
    return response.json()
  },

  async delete(id: number): Promise<boolean> {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete product')
    return response.json()
  }
}
