import { formatFiltersToApiParams } from '../../utils/reportFormatters'
import type { ReportFilters } from '../../types'

export const useReportFilters = () => {
  const filters = ref<ReportFilters>({})
  const searchQuery = ref<Record<string, any>>({})

  const applyFilters = (newFilters: ReportFilters) => {
    filters.value = { ...newFilters }
    searchQuery.value = formatFiltersToApiParams(filters.value)
  }

  const applySearch = (text: string) => {
    searchQuery.value = {
      ...(text ? { text: { value: text } } : {}),
    }
  }

  const clearFilters = () => {
    filters.value = {}
    searchQuery.value = {}
  }

  const hasActiveFilters = computed(() => {
    return Object.keys(filters.value).some(key => filters.value[key as keyof ReportFilters] != null)
  })

  return {
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    clearFilters,
    hasActiveFilters,
  }
}
