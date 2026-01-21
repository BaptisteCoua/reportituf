<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon start>mdi-account-group</v-icon>
        Utilisateurs (Approche POO)
        <v-spacer />
        <v-chip color="primary" variant="tonal" size="small">
          datatable-v2
        </v-chip>
      </v-card-title>

      <v-card-text>
        <UserPooUserFilters
          :search="search"
          :gender="gender"
          @update:search="onSearchChange"
          @update:gender="onGenderChange"
          @clear="onClearFilters"
        />

        <UserPooUserTable
          :items="items"
          :headers="headers"
          :loading="loading"
          :page="page"
          :items-per-page="itemsPerPage"
          :total-items="totalItems"
          :total-pages="totalPages"
          :sort-key="sortKey"
          :sort-order="sortOrder"
          @update:page="onPageChange"
          @update:items-per-page="onItemsPerPageChange"
          @sort="onSort"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type { User } from '../../types'
import type { DataTableHeader } from '~/modules/datatable-v2/src'

defineProps<{
  items: User[]
  headers: DataTableHeader[]
  loading: boolean
  page: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  sortKey: string | null
  sortOrder: 'asc' | 'desc' | null
  search: string
  gender: string | undefined
}>()

defineEmits<{
  'update:page': [value: number]
  'update:itemsPerPage': [value: number]
  'sort': [key: string]
  'update:search': [value: string]
  'update:gender': [value: string | undefined]
  'clearFilters': []
}>()

const emit = defineEmits<{
  'update:page': [value: number]
  'update:itemsPerPage': [value: number]
  'sort': [key: string]
  'update:search': [value: string]
  'update:gender': [value: string | undefined]
  'clearFilters': []
}>()

function onPageChange(value: number) {
  emit('update:page', value)
}

function onItemsPerPageChange(value: number) {
  emit('update:itemsPerPage', value)
}

function onSort(key: string) {
  emit('sort', key)
}

function onSearchChange(value: string) {
  emit('update:search', value)
}

function onGenderChange(value: string | undefined) {
  emit('update:gender', value)
}

function onClearFilters() {
  emit('clearFilters')
}
</script>
