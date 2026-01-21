import { ref, computed } from 'vue'
import { DateTimePicker } from '../../../modules/date-time-picker/src/DateTimePicker'
import type { Product, CreateProductPayload, Category, ProductFormData } from '../types'
import { ProductService } from '../services/ProductService'
import { CategoryService } from '../services/CategoryService'

const initialFormData: ProductFormData = {
  title: '',
  price: 0,
  description: '',
  categoryId: null,
  images: ['https://placeimg.com/640/480/any'],
  availableFrom: null,
  availableTo: null
}

export function useProductForm() {
  const form = ref<ProductFormData>({ ...initialFormData })
  const isSubmitting = ref(false)
  const errors = ref<Partial<Record<keyof ProductFormData, string>>>({})
  const dialog = ref(false)
  const editingProduct = ref<Product | null>(null)
  const categories = ref<Category[]>([])

  const availableFromPicker = new DateTimePicker({
    mode: 'single',
    dateTimeMode: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    autoCorrect: true
  })

  const availableToPicker = new DateTimePicker({
    mode: 'single',
    dateTimeMode: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    autoCorrect: true
  })

  const isEditing = computed(() => editingProduct.value !== null)

  const loadCategories = async () => {
    categories.value = await CategoryService.getAll()
  }

  const validate = (): boolean => {
    errors.value = {}

    if (!form.value.title.trim()) {
      errors.value.title = 'Title is required'
    }

    if (form.value.price <= 0) {
      errors.value.price = 'Price must be greater than 0'
    }

    if (!form.value.description.trim()) {
      errors.value.description = 'Description is required'
    }

    if (!form.value.categoryId) {
      errors.value.categoryId = 'Category is required'
    }

    if (form.value.images.length === 0) {
      errors.value.images = 'At least one image is required'
    }

    const fromDate = availableFromPicker.getSelectedDate().value
    const toDate = availableToPicker.getSelectedDate().value

    if (fromDate && toDate && fromDate > toDate) {
      errors.value.availableFrom = 'Start date must be before end date'
    }

    return Object.keys(errors.value).length === 0
  }

  const submit = async (): Promise<Product | null> => {
    if (!validate()) return null

    isSubmitting.value = true
    try {
      const payload: CreateProductPayload = {
        title: form.value.title,
        price: form.value.price,
        description: form.value.description,
        categoryId: form.value.categoryId!,
        images: form.value.images
      }

      if (isEditing.value && editingProduct.value) {
        return await ProductService.update({ id: editingProduct.value.id, ...payload })
      }

      return await ProductService.create(payload)
    } finally {
      isSubmitting.value = false
    }
  }

  const reset = () => {
    form.value = { ...initialFormData }
    errors.value = {}
    editingProduct.value = null
    availableFromPicker.reset()
    availableToPicker.reset()
  }

  const openCreate = async () => {
    reset()
    await loadCategories()
    dialog.value = true
  }

  const openEdit = async (product: Product) => {
    await loadCategories()
    editingProduct.value = product
    form.value = {
      title: product.title,
      price: product.price,
      description: product.description,
      categoryId: product.category.id,
      images: [...product.images],
      availableFrom: null,
      availableTo: null
    }
    dialog.value = true
  }

  const close = () => {
    dialog.value = false
    reset()
  }

  const setAvailableFrom = (date: Date | string | null) => {
    availableFromPicker.setDate(date)
    form.value.availableFrom = availableFromPicker.getSelectedDate().value
    availableToPicker.setMinDate(form.value.availableFrom)
  }

  const setAvailableTo = (date: Date | string | null) => {
    availableToPicker.setDate(date)
    form.value.availableTo = availableToPicker.getSelectedDate().value
  }

  return {
    form,
    errors,
    isSubmitting,
    isEditing,
    dialog,
    editingProduct,
    categories,
    availableFrom: availableFromPicker.getSelectedDate(),
    availableTo: availableToPicker.getSelectedDate(),
    availableFromFormatted: availableFromPicker.getFormattedValue(),
    availableToFormatted: availableToPicker.getFormattedValue(),
    availableFromError: availableFromPicker.getError(),
    availableToError: availableToPicker.getError(),
    validate,
    submit,
    reset,
    openCreate,
    openEdit,
    close,
    setAvailableFrom,
    setAvailableTo,
    loadCategories
  }
}
