import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CategoryService } from '../services/CategoryService'

const mockCategory = {
  id: 1,
  name: 'Electronics',
  image: 'https://example.com/cat.jpg',
  creationAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}

describe('CategoryService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all categories', async () => {
      const mockCategories = [mockCategory]
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCategories)
      })

      const result = await CategoryService.getAll()

      expect(fetch).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/categories')
      expect(result).toEqual(mockCategories)
    })

    it('should throw error on failed request', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false })

      await expect(CategoryService.getAll()).rejects.toThrow('Failed to fetch categories')
    })
  })

  describe('getById', () => {
    it('should fetch category by id', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCategory)
      })

      const result = await CategoryService.getById(1)

      expect(fetch).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/categories/1')
      expect(result).toEqual(mockCategory)
    })

    it('should throw error on failed request', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false })

      await expect(CategoryService.getById(1)).rejects.toThrow('Failed to fetch category')
    })
  })
})
