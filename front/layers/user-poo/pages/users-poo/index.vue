<template>
  <UserPooUserListTemplate
    :items="items"
    :headers="headers"
    :loading="isLoading"
    :page="pagination.page"
    :items-per-page="pagination.itemsPerPage"
    :total-items="pagination.totalItems"
    :total-pages="pagination.totalPages"
    :sort-key="sort?.key || null"
    :sort-order="sort?.order || null"
    :search="search"
    :gender="filters.gender as string | undefined"
    @update:page="setPage"
    @update:items-per-page="setItemsPerPage"
    @sort="toggleSort"
    @update:search="onSearchChange"
    @update:gender="onGenderChange"
    @clear-filters="onClearFilters"
  />
</template>

<script setup lang="ts">
import { useUserTable } from '../../composables/useUserTable'

const {
  items,
  headers,
  pagination,
  sort,
  isLoading,
  search,
  filters,
  fetchItems,
  setPage,
  setItemsPerPage,
  toggleSort,
  setSearch,
  setFilter,
  clearFilters
} = useUserTable()

onMounted(() => {
  fetchItems()
})

function onSearchChange(value: string) {
  setSearch(value)
}

function onGenderChange(value: string | undefined) {
  if (value) {
    setFilter('gender', value)
  } else {
    clearFilters()
    fetchItems()
  }
}

function onClearFilters() {
  clearFilters()
  fetchItems()
}
</script>
