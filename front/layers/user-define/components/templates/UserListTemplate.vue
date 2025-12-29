<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon start>mdi-account-group</v-icon>
        Utilisateurs (Approche Define)
        <v-spacer />
        <v-chip color="success" variant="tonal" size="small">
          datatable-define
        </v-chip>
      </v-card-title>

      <v-card-text>
        <UserDefineUserFilters
          :search="search"
          :gender="gender"
          @update:search="$emit('update:search', $event)"
          @update:gender="$emit('update:gender', $event)"
          @clear="$emit('clearFilters')"
        />

        <UserDefineUserTable
          :items="items"
          :headers="headers"
          :loading="loading"
          :page="page"
          :items-per-page="itemsPerPage"
          :total-items="totalItems"
          :total-pages="totalPages"
          :sort-key="sortKey"
          :sort-order="sortOrder"
          @update:page="$emit('update:page', $event)"
          @update:items-per-page="$emit('update:itemsPerPage', $event)"
          @sort="$emit('sort', $event)"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type { User } from '../../types'

defineProps<{
  items: User[]
  headers: { key: string; title: string; sortable?: boolean }[]
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
</script>
