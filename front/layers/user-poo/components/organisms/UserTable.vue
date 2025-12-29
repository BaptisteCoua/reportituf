<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPageValue"
    v-model:page="pageValue"
    :headers="headers"
    :items="items"
    :items-length="totalItems"
    :loading="loading"
    :sort-by="sortBy"
    class="elevation-1"
    @update:sort-by="onSortChange"
  >
    <template #item.image="{ item }">
      <v-avatar size="40">
        <v-img :src="item.image" :alt="item.firstName" />
      </v-avatar>
    </template>

    <template #item.gender="{ item }">
      <v-chip
        :color="item.gender === 'male' ? 'blue' : 'pink'"
        size="small"
        variant="tonal"
      >
        {{ item.gender === 'male' ? 'Homme' : 'Femme' }}
      </v-chip>
    </template>

    <template #item.company.name="{ item }">
      {{ item.company?.name || '-' }}
    </template>

    <template #bottom>
      <v-divider />
      <div class="d-flex align-center justify-space-between pa-4">
        <div class="text-caption text-grey">
          {{ totalItems }} utilisateur(s) au total
        </div>
        <v-pagination
          v-model="pageValue"
          :length="totalPages"
          :total-visible="5"
          density="compact"
        />
      </div>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import type { User } from '../../types'

const props = defineProps<{
  items: User[]
  headers: { key: string; title: string; sortable?: boolean }[]
  loading: boolean
  page: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  sortKey: string | null
  sortOrder: 'asc' | 'desc' | null
}>()

const emit = defineEmits<{
  'update:page': [value: number]
  'update:itemsPerPage': [value: number]
  'sort': [key: string]
}>()

const pageValue = computed({
  get: () => props.page,
  set: (value) => emit('update:page', value)
})

const itemsPerPageValue = computed({
  get: () => props.itemsPerPage,
  set: (value) => emit('update:itemsPerPage', value)
})

const sortBy = computed(() => {
  if (!props.sortKey) return []
  return [{ key: props.sortKey, order: props.sortOrder || 'asc' }]
})

function onSortChange(sortOptions: { key: string; order: 'asc' | 'desc' }[]) {
  if (sortOptions.length > 0) {
    emit('sort', sortOptions[0].key)
  }
}
</script>
