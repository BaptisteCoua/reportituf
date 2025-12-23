<script setup lang="ts">
import type { User } from '../../types'
import type { DataTableHeader } from '../../../../modules/datatable-define/src/types'

interface Props {
  items: User[]
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
  (e: 'edit', user: User): void
  (e: 'delete', user: User): void
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
    @click:row="(_: unknown, { item }: { item: User }) => $emit('edit', item)"
  >
    <template #item.avatar="{ item }">
      <UserAvatar :src="item.avatar" :alt="item.name" :size="32" />
    </template>

    <template #item.role="{ item }">
      <UserRoleBadge :role="item.role" />
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
