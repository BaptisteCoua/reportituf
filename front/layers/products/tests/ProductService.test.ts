import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductService } from '../services/ProductService'

const mockCategory = {
  id: 1,
  name: 'Electronics',
  image: 'https://example.com/cat.jpg',
  creationAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}

const mockProduct = {
  id: 1,
  title: 'Laptop',
  price: 999,
  description: 'A powerful laptop',
  category: mockCategory,
  images: ['https://example.com/laptop.jpg'],
  creationAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}

describe('ProductService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all products', async () => {
      const mockProducts = [mockProduct]
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProducts)
      })

      const result = await ProductService.getAll()

      expect(fetch).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/products')
      expect(result).toEqual(mockProducts)
    })

    it('should throw error on failed request', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false })

      await expect(ProductService.getAll()).rejects.toThrow('Failed to fetch products')
    })
  })

  describe('getById', () => {
    it('should fetch product by id', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      })

      const result = await ProductService.getById(1)

      expect(fetch).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/products/1')
      expect(result).toEqual(mockProduct)
    })
  })

  describe('getByCategory', () => {
    it('should fetch products by category', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockProduct])
      })

      const result = await ProductService.getByCategory(1)

      expect(fetch).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/categories/1/products')
      expect(result).toHaveLength(1)
    })
  })

  describe('getPaginated', () => {
    it('should fetch paginated products', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockProduct])
      })

      const result = await ProductService.getPaginated(0, 10)

      expect(fetch).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/products?offset=0&limit=10')
      expect(result).toHaveLength(1)
    })
  })

  describe('create', () => {
    it('should create a new product', async () => {
      const payload = {
        title: 'New Laptop',
        price: 1299,
        description: 'A new laptop',
        categoryId: 1,
        images: ['https://example.com/new.jpg']
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ...mockProduct, ...payload, id: 2 })
      })

      const result = await ProductService.create(payload)

      expect(fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/products',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )
      expect(result.title).toBe('New Laptop')
    })
  })

  describe('update', () => {
    it('should update an existing product', async () => {
      const payload = { id: 1, title: 'Updated Laptop' }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ...mockProduct, title: 'Updated Laptop' })
      })

      const result = await ProductService.update(payload)

      expect(fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/products/1',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Updated Laptop' })
        }
      )
      expect(result.title).toBe('Updated Laptop')
    })
  })

  describe('delete', () => {
    it('should delete a product', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(true)
      })

      const result = await ProductService.delete(1)

      expect(fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/products/1',
        { method: 'DELETE' }
      )
      expect(result).toBe(true)
    })
  })
})
