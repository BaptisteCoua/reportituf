<script setup lang="ts">
import type { Category } from '../../types'

interface Props {
  search: string
  categoryId: number | null
  categories: Category[]
}

interface Emits {
  (e: 'update:search', value: string): void
  (e: 'update:categoryId', value: number | null): void
}

defineProps<Props>()
defineEmits<Emits>()

const categoryOptions = computed(() => {
  return [
    { title: 'All Categories', value: null },
    ...categories.map(c => ({ title: c.name, value: c.id }))
  ]
})
</script>

<template>
  <div class="d-flex align-center ga-4">
    <ProductSearchInput
      :model-value="search"
      placeholder="Search products..."
      class="flex-grow-1"
      style="max-width: 400px"
      @update:model-value="$emit('update:search', $event)"
    />
    <v-select
      :model-value="categoryId"
      :items="categoryOptions"
      label="Category"
      variant="outlined"
      density="compact"
      hide-details
      style="max-width: 200px"
      @update:model-value="$emit('update:categoryId', $event)"
    />
  </div>
</template>
