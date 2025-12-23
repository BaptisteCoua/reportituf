<script setup lang="ts">
import type { Product, Category, ProductFormData } from '../../types'
import type { DataTableHeader } from '../../../../modules/datatable-v2/src/types/DataTable.types'

interface Props {
  items: Product[]
  headers: DataTableHeader[]
  loading: boolean
  page: number
  itemsPerPage: number
  totalItems: number
  search: string
  categoryFilter: number | null
  categories: Category[]
  dialogOpen: boolean
  form: ProductFormData
  formErrors: Partial<Record<keyof ProductFormData, string>>
  isEditing: boolean
  isSubmitting: boolean
  availableFromFormatted: string | null
  availableToFormatted: string | null
  availableFromError: { message: string } | null
  availableToError: { message: string } | null
}

interface Emits {
  (e: 'update:page', value: number): void
  (e: 'update:itemsPerPage', value: number): void
  (e: 'update:search', value: string): void
  (e: 'update:categoryFilter', value: number | null): void
  (e: 'update:dialogOpen', value: boolean): void
  (e: 'update:form', value: ProductFormData): void
  (e: 'update:availableFrom', value: string): void
  (e: 'update:availableTo', value: string): void
  (e: 'sort', key: string): void
  (e: 'edit', product: Product): void
  (e: 'delete', product: Product): void
  (e: 'add'): void
  (e: 'submit'): void
  (e: 'cancel'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">Products</h1>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="$emit('add')"
          >
            Add Product
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <ProductFilters
              :search="search"
              :category-id="categoryFilter"
              :categories="categories"
              class="mb-4"
              @update:search="$emit('update:search', $event)"
              @update:category-id="$emit('update:categoryFilter', $event)"
            />
            <ProductTable
              :items="items"
              :headers="headers"
              :loading="loading"
              :page="page"
              :items-per-page="itemsPerPage"
              :total-items="totalItems"
              @update:page="$emit('update:page', $event)"
              @update:items-per-page="$emit('update:itemsPerPage', $event)"
              @sort="$emit('sort', $event)"
              @edit="$emit('edit', $event)"
              @delete="$emit('delete', $event)"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <ProductFormDialog
      :model-value="dialogOpen"
      :form="form"
      :errors="formErrors"
      :categories="categories"
      :is-editing="isEditing"
      :is-submitting="isSubmitting"
      :available-from-formatted="availableFromFormatted"
      :available-to-formatted="availableToFormatted"
      :available-from-error="availableFromError"
      :available-to-error="availableToError"
      @update:model-value="$emit('update:dialogOpen', $event)"
      @update:form="$emit('update:form', $event)"
      @update:available-from="$emit('update:availableFrom', $event)"
      @update:available-to="$emit('update:availableTo', $event)"
      @submit="$emit('submit')"
      @cancel="$emit('cancel')"
    />
  </v-container>
</template>
