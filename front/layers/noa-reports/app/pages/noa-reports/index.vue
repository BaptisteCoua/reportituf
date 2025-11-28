<template>
  <div class="pa-6">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4">Rapports NOA</h1>
      <v-btn
        to="/noa-reports/new"
        color="primary"
        prepend-icon="mdi-plus"
      >
        Nouveau rapport
      </v-btn>
    </div>

    <ReportFilters
      @search="handleSearch"
      @filter="handleFilter"
      class="mb-4"
    />

    <ReportList
      :reports="reports"
      :is-loading="isLoading"
      :has-more="hasMore"
      @load-more="handleLoadMore"
    />
  </div>
</template>

<script setup lang="ts">
const {
  reports,
  isLoading,
  hasMore,
  loadReports,
  loadMore,
  searchReports,
  filterReports,
} = useReportOrchestrator()

onMounted(async () => {
  await loadReports()
})

const handleSearch = async (text: string) => {
  await searchReports(text)
}

const handleFilter = async (filters: any) => {
  await filterReports(filters)
}

const handleLoadMore = async () => {
  await loadMore()
}

definePageMeta({
  title: 'Rapports NOA',
})
</script>
