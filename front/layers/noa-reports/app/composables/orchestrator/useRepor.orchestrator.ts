import { storeToRefs } from 'pinia'
import { useReportStore } from '../../stores/useReport.store'
import { useReportConnector } from '../connector/useReport.connector'
import { useReportLogic } from '../logic/useReport.logic'
import { useReportFilters } from '../logic/useReportFilters.logic'

export const useReportOrchestrator = () => {
  const store = useReportStore()
  const storeRefs = storeToRefs(store)

  const connector = useReportConnector()
  const logic = useReportLogic()
  const filtersLogic = useReportFilters()

  const loadReports = async (append = false) => {
    if (!append) {
      logic.resetPagination()
    }

    const response = await connector.fetchReports({
      ...filtersLogic.searchQuery.value,
      page: logic.currentPage.value,
    })

    logic.setHasMore(response.last_page)

    return response
  }

  const loadMore = async () => {
    logic.incrementPage()
    return await loadReports(true)
  }

  const searchReports = (text: string) => {
    filtersLogic.applySearch(text)
    return loadReports(false)
  }

  const filterReports = (filters: any) => {
    filtersLogic.applyFilters(filters)
    return loadReports(false)
  }

  return {
    reports: storeRefs.reports,
    currentReport: storeRefs.currentReport,
    isLoading: storeRefs.isLoading,
    error: storeRefs.error,
    totalCount: storeRefs.totalCount,
    draftReports: storeRefs.draftReports,
    publishedReports: storeRefs.publishedReports,

    currentPage: logic.currentPage,
    hasMore: logic.hasMore,
    searchText: logic.searchText,
    filters: filtersLogic.filters,
    hasActiveFilters: filtersLogic.hasActiveFilters,

    loadReports,
    loadMore,
    searchReports,
    filterReports,
    fetchReportById: connector.fetchReportById,
    createReport: connector.createReport,
    updateReport: connector.updateReport,
    deleteReport: connector.deleteReport,

    validateReport: logic.validateReport,
    validateSubject: logic.validateSubject,
    canEdit: logic.canEdit,
    canDelete: logic.canDelete,
    clearFilters: filtersLogic.clearFilters,
  }
}
