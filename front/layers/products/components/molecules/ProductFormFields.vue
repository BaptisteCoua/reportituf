<script setup lang="ts">
import type { Category, ProductFormData } from '../../types'

interface Props {
  modelValue: ProductFormData
  errors: Partial<Record<keyof ProductFormData, string>>
  categories: Category[]
  availableFromFormatted: string | null
  availableToFormatted: string | null
  availableFromError: { message: string } | null
  availableToError: { message: string } | null
}

interface Emits {
  (e: 'update:modelValue', value: ProductFormData): void
  (e: 'update:availableFrom', value: string): void
  (e: 'update:availableTo', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const categoryOptions = computed(() => {
  return props.categories.map(c => ({ title: c.name, value: c.id }))
})

const updateField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const updateImage = (index: number, value: string) => {
  const newImages = [...props.modelValue.images]
  newImages[index] = value
  updateField('images', newImages)
}

const addImage = () => {
  updateField('images', [...props.modelValue.images, ''])
}

const removeImage = (index: number) => {
  const newImages = props.modelValue.images.filter((_, i) => i !== index)
  updateField('images', newImages)
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        :model-value="modelValue.title"
        :error-messages="errors.title"
        label="Title"
        variant="outlined"
        @update:model-value="updateField('title', $event)"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        :model-value="modelValue.price"
        :error-messages="errors.price"
        label="Price"
        type="number"
        prefix="$"
        variant="outlined"
        @update:model-value="updateField('price', Number($event))"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-select
        :model-value="modelValue.categoryId"
        :items="categoryOptions"
        :error-messages="errors.categoryId"
        label="Category"
        variant="outlined"
        @update:model-value="updateField('categoryId', $event)"
      />
    </v-col>
    <v-col cols="12">
      <v-textarea
        :model-value="modelValue.description"
        :error-messages="errors.description"
        label="Description"
        variant="outlined"
        rows="3"
        @update:model-value="updateField('description', $event)"
      />
    </v-col>

    <v-col cols="12">
      <div class="text-subtitle-2 mb-2">Images</div>
      <div v-for="(image, index) in modelValue.images" :key="index" class="d-flex ga-2 mb-2">
        <v-text-field
          :model-value="image"
          :label="`Image ${index + 1}`"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="updateImage(index, $event)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          :disabled="modelValue.images.length <= 1"
          @click="removeImage(index)"
        />
      </div>
      <v-btn
        variant="text"
        size="small"
        prepend-icon="mdi-plus"
        @click="addImage"
      >
        Add Image
      </v-btn>
      <div v-if="errors.images" class="text-error text-caption mt-1">{{ errors.images }}</div>
    </v-col>

    <v-col cols="12" md="6">
      <ProductDateTimeInput
        :model-value="availableFromFormatted"
        :error="availableFromError?.message"
        label="Available From"
        @update:model-value="$emit('update:availableFrom', $event)"
      />
    </v-col>
    <v-col cols="12" md="6">
      <ProductDateTimeInput
        :model-value="availableToFormatted"
        :error="availableToError?.message"
        label="Available To"
        @update:model-value="$emit('update:availableTo', $event)"
      />
    </v-col>
  </v-row>
</template>
