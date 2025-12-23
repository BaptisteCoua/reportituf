<script setup lang="ts">
import type { Category, ProductFormData } from '../../types'

interface Props {
  modelValue: boolean
  form: ProductFormData
  errors: Partial<Record<keyof ProductFormData, string>>
  categories: Category[]
  isEditing: boolean
  isSubmitting: boolean
  availableFromFormatted: string | null
  availableToFormatted: string | null
  availableFromError: { message: string } | null
  availableToError: { message: string } | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:form', value: ProductFormData): void
  (e: 'update:availableFrom', value: string): void
  (e: 'update:availableTo', value: string): void
  (e: 'submit'): void
  (e: 'cancel'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="700"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>
        {{ isEditing ? 'Edit Product' : 'Add Product' }}
      </v-card-title>
      <v-card-text>
        <ProductFormFields
          :model-value="form"
          :errors="errors"
          :categories="categories"
          :available-from-formatted="availableFromFormatted"
          :available-to-formatted="availableToFormatted"
          :available-from-error="availableFromError"
          :available-to-error="availableToError"
          @update:model-value="$emit('update:form', $event)"
          @update:available-from="$emit('update:availableFrom', $event)"
          @update:available-to="$emit('update:availableTo', $event)"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          :disabled="isSubmitting"
          @click="$emit('cancel')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="isSubmitting"
          @click="$emit('submit')"
        >
          {{ isEditing ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
