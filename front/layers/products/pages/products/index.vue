<script setup lang="ts">
import { useProductTable } from '../../composables/useProductTable'
import { useProductForm } from '../../composables/useProductForm'
import { ProductService } from '../../services/ProductService'
import { CategoryService } from '../../services/CategoryService'
import type { Product, Category } from '../../types'

const table = useProductTable()
const productForm = useProductForm()

const categoryFilter = ref<number | null>(null)
const categories = ref<Category[]>([])

onMounted(async () => {
  categories.value = await CategoryService.getAll()
})

const handleSearch = (value: string) => {
  table.setSearch(value)
}

const handleCategoryFilter = (value: number | null) => {
  categoryFilter.value = value
  table.setFilter('categoryId', value)
}

const handlePageChange = async (page: number) => {
  await table.setPage(page)
}

const handleItemsPerPageChange = async (itemsPerPage: number) => {
  await table.setItemsPerPage(itemsPerPage)
}

const handleSort = async (key: string) => {
  await table.toggleSort(key)
}

const handleEdit = (product: Product) => {
  productForm.openEdit(product)
}

const handleDelete = async (product: Product) => {
  if (confirm(`Delete product ${product.title}?`)) {
    await ProductService.delete(product.id)
    await table.refresh()
  }
}

const handleAdd = () => {
  productForm.openCreate()
}

const handleSubmit = async () => {
  const result = await productForm.submit()
  if (result) {
    productForm.close()
    await table.refresh()
  }
}

const handleCancel = () => {
  productForm.close()
}

const handleAvailableFromChange = (value: string) => {
  productForm.setAvailableFrom(value)
}

const handleAvailableToChange = (value: string) => {
  productForm.setAvailableTo(value)
}
</script>

<template>
  <ProductListTemplate
    :items="table.items.value"
    :headers="table.headers.value"
    :loading="table.isLoading.value"
    :page="table.pagination.value.page"
    :items-per-page="table.pagination.value.itemsPerPage"
    :total-items="table.pagination.value.totalItems"
    :search="table.search.value"
    :category-filter="categoryFilter"
    :categories="categories"
    :dialog-open="productForm.dialog.value"
    :form="productForm.form.value"
    :form-errors="productForm.errors.value"
    :is-editing="productForm.isEditing.value"
    :is-submitting="productForm.isSubmitting.value"
    :available-from-formatted="productForm.availableFromFormatted.value"
    :available-to-formatted="productForm.availableToFormatted.value"
    :available-from-error="productForm.availableFromError.value"
    :available-to-error="productForm.availableToError.value"
    @update:page="handlePageChange"
    @update:items-per-page="handleItemsPerPageChange"
    @update:search="handleSearch"
    @update:category-filter="handleCategoryFilter"
    @update:dialog-open="productForm.dialog.value = $event"
    @update:form="productForm.form.value = $event"
    @update:available-from="handleAvailableFromChange"
    @update:available-to="handleAvailableToChange"
    @sort="handleSort"
    @edit="handleEdit"
    @delete="handleDelete"
    @add="handleAdd"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>
