export interface Category {
  id: number
  name: string
  image: string
  creationAt: string
  updatedAt: string
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: Category
  images: string[]
  creationAt: string
  updatedAt: string
}

export interface ProductFilters {
  search: string
  categoryId: number | null
  priceMin: number | null
  priceMax: number | null
}

export interface CreateProductPayload {
  title: string
  price: number
  description: string
  categoryId: number
  images: string[]
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id: number
}

export interface ProductFormData {
  title: string
  price: number
  description: string
  categoryId: number | null
  images: string[]
  availableFrom: Date | null
  availableTo: Date | null
}
