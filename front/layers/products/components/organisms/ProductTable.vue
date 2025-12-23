<script setup lang="ts">
import type { Product } from '../../types'
import type { DataTableHeader } from '../../../../modules/datatable-v2/src/types/DataTable.types'

interface Props {
  items: Product[]
  headers: DataTableHeader[]
  loading?: boolean
  page: number
  itemsPerPage: number
  totalItems: number
}

interface Emits {
  (e: 'update:page', value: number): void
  (e: 'update:itemsPerPage', value: number): void
  (e: 'sort', key: string): void
  (e: 'edit', product: Product): void
  (e: 'delete', product: Product): void
}

withDefaults(defineProps<Props>(), {
  loading: false
})

defineEmits<Emits>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<template>
  <v-data-table-server
    :headers="headers"
    :items="items"
    :loading="loading"
    :items-length="totalItems"
    :page="page"
    :items-per-page="itemsPerPage"
    @update:page="$emit('update:page', $event)"
    @update:items-per-page="$emit('update:itemsPerPage', $event)"
    @click:row="(_: unknown, { item }: { item: Product }) => $emit('edit', item)"
  >
    <template #item.images="{ item }">
      <ProductImage :src="item.images[0]" :alt="item.title" :size="40" />
    </template>

    <template #item.price="{ item }">
      <ProductPriceBadge :price="item.price" />
    </template>

    <template #item.category.name="{ item }">
      <ProductCategoryChip :name="item.category.name" />
    </template>

    <template #item.creationAt="{ item }">
      {{ formatDate(item.creationAt) }}
    </template>

    <template #item.actions="{ item }">
      <div class="d-flex ga-1">
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click.stop="$emit('edit', item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click.stop="$emit('delete', item)"
        />
      </div>
    </template>
  </v-data-table-server>
</template>
