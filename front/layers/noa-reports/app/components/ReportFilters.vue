<template>
  <v-card flat border class="pa-4">
    <div class="d-flex align-center flex-wrap ga-4 justify-space-between">
      <v-text-field
        v-model="searchText"
        placeholder="Rechercher un rapport"
        prepend-inner-icon="mdi-magnify"
        density="comfortable"
        hide-details
        variant="outlined"
        class="search-input"
        @keydown.enter="handleSearch"
        clearable
      />

      <div class="d-flex align-center ga-3">
        <v-select
          v-model="localFilters.status"
          placeholder="Statut"
          :items="statusOptions"
          item-title="name"
          item-value="id"
          density="comfortable"
          hide-details
          variant="outlined"
          clearable
          class="filter-select"
        />

        <v-select
          v-model="localFilters.team"
          placeholder="Équipe"
          :items="teamOptions"
          item-title="name"
          item-value="id"
          density="comfortable"
          hide-details
          variant="outlined"
          clearable
          class="filter-select"
        />

        <v-select
          v-model="localFilters.reporter"
          placeholder="Rapporteur"
          :items="userOptions"
          item-title="name"
          item-value="id"
          density="comfortable"
          hide-details
          variant="outlined"
          clearable
          class="filter-select"
        />

        <v-text-field
          v-model="localFilters.date"
          type="date"
          placeholder="Date"
          prepend-inner-icon="mdi-calendar"
          density="comfortable"
          hide-details
          variant="outlined"
          clearable
          class="filter-select"
        />

        <v-btn
          v-if="hasActiveFilters"
          @click="handleClearFilters"
          variant="text"
          color="error"
          size="small"
        >
          <v-icon start>mdi-filter-off</v-icon>
          Effacer
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { ReportFilters } from '../../types'

const emit = defineEmits<{
  search: [text: string]
  filter: [filters: ReportFilters]
}>()

const searchText = ref('')
const localFilters = ref<ReportFilters>({})

const statusOptions = ref([
  { id: 1, name: 'Brouillon' },
  { id: 2, name: 'Publié' },
  { id: 3, name: 'Archivé' },
])

const teamOptions = ref([
  { id: 1, name: 'Équipe A' },
  { id: 2, name: 'Équipe B' },
])

const userOptions = ref([
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
])

const hasActiveFilters = computed(() => {
  return Object.values(localFilters.value).some(v => v != null)
})

const handleSearch = () => {
  emit('search', searchText.value)
}

const handleClearFilters = () => {
  localFilters.value = {}
  searchText.value = ''
  emit('filter', {})
}

watch(localFilters, (newFilters) => {
  emit('filter', newFilters)
}, { deep: true })
</script>

<style scoped>
.search-input {
  width: 400px;
}

.filter-select {
  width: 150px;
}
</style>
