import { describe, it, expect, vi, beforeEach } from 'vitest'
import './setup'
import { useProductForm } from '../composables/useProductForm'
import { ProductService } from '../services/ProductService'
import { CategoryService } from '../services/CategoryService'

vi.mock('../services/ProductService', () => ({
  ProductService: {
    create: vi.fn(),
    update: vi.fn()
  }
}))

vi.mock('../services/CategoryService', () => ({
  CategoryService: {
    getAll: vi.fn()
  }
}))

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

describe('useProductForm', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(CategoryService.getAll).mockResolvedValue([mockCategory])
  })

  describe('initial state', () => {
    it('should have empty form values', () => {
      const { form } = useProductForm()

      expect(form.value.title).toBe('')
      expect(form.value.price).toBe(0)
      expect(form.value.description).toBe('')
      expect(form.value.categoryId).toBeNull()
    })

    it('should not be in editing mode', () => {
      const { isEditing } = useProductForm()

      expect(isEditing.value).toBe(false)
    })

    it('should have dialog closed', () => {
      const { dialog } = useProductForm()

      expect(dialog.value).toBe(false)
    })

    it('should have default image', () => {
      const { form } = useProductForm()

      expect(form.value.images).toHaveLength(1)
      expect(form.value.images[0]).toContain('placeimg')
    })
  })

  describe('validation', () => {
    it('should fail validation with empty title', () => {
      const { form, validate, errors } = useProductForm()
      form.value.price = 100
      form.value.description = 'Test'
      form.value.categoryId = 1

      const result = validate()

      expect(result).toBe(false)
      expect(errors.value.title).toBe('Title is required')
    })

    it('should fail validation with zero price', () => {
      const { form, validate, errors } = useProductForm()
      form.value.title = 'Product'
      form.value.description = 'Test'
      form.value.categoryId = 1

      const result = validate()

      expect(result).toBe(false)
      expect(errors.value.price).toBe('Price must be greater than 0')
    })

    it('should fail validation without category', () => {
      const { form, validate, errors } = useProductForm()
      form.value.title = 'Product'
      form.value.price = 100
      form.value.description = 'Test'

      const result = validate()

      expect(result).toBe(false)
      expect(errors.value.categoryId).toBe('Category is required')
    })

    it('should pass validation with valid data', () => {
      const { form, validate, errors } = useProductForm()
      form.value.title = 'Product'
      form.value.price = 100
      form.value.description = 'Test description'
      form.value.categoryId = 1

      const result = validate()

      expect(result).toBe(true)
      expect(Object.keys(errors.value)).toHaveLength(0)
    })
  })

  describe('openCreate', () => {
    it('should reset form and open dialog', async () => {
      const { form, dialog, openCreate } = useProductForm()
      form.value.title = 'Test'

      await openCreate()

      expect(dialog.value).toBe(true)
      expect(form.value.title).toBe('')
      expect(CategoryService.getAll).toHaveBeenCalled()
    })
  })

  describe('openEdit', () => {
    it('should populate form with product data', async () => {
      const { form, dialog, isEditing, openEdit } = useProductForm()

      await openEdit(mockProduct)

      expect(dialog.value).toBe(true)
      expect(isEditing.value).toBe(true)
      expect(form.value.title).toBe('Laptop')
      expect(form.value.price).toBe(999)
      expect(form.value.categoryId).toBe(1)
    })
  })

  describe('submit', () => {
    it('should create product when not editing', async () => {
      const { form, submit } = useProductForm()
      form.value.title = 'New Product'
      form.value.price = 100
      form.value.description = 'Test'
      form.value.categoryId = 1

      vi.mocked(ProductService.create).mockResolvedValue(mockProduct)

      const result = await submit()

      expect(ProductService.create).toHaveBeenCalled()
      expect(result).toEqual(mockProduct)
    })

    it('should update product when editing', async () => {
      const { form, openEdit, submit } = useProductForm()
      await openEdit(mockProduct)
      form.value.title = 'Updated Laptop'

      vi.mocked(ProductService.update).mockResolvedValue({ ...mockProduct, title: 'Updated Laptop' })

      const result = await submit()

      expect(ProductService.update).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, title: 'Updated Laptop' })
      )
      expect(result?.title).toBe('Updated Laptop')
    })

    it('should return null on validation failure', async () => {
      const { submit } = useProductForm()

      const result = await submit()

      expect(result).toBeNull()
      expect(ProductService.create).not.toHaveBeenCalled()
    })
  })

  describe('date pickers', () => {
    it('should set available from date', () => {
      const { setAvailableFrom, availableFrom } = useProductForm()
      const testDate = new Date('2025-01-15')

      setAvailableFrom(testDate)

      expect(availableFrom.value).toEqual(testDate)
    })

    it('should set available to date', () => {
      const { setAvailableTo, availableTo } = useProductForm()
      const testDate = new Date('2025-02-15')

      setAvailableTo(testDate)

      expect(availableTo.value).toEqual(testDate)
    })
  })

  describe('close', () => {
    it('should close dialog and reset form', async () => {
      const { form, dialog, openCreate, close } = useProductForm()
      await openCreate()
      form.value.title = 'Test'

      close()

      expect(dialog.value).toBe(false)
      expect(form.value.title).toBe('')
    })
  })
})
