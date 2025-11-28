import { validateReportData } from '../../utils/reportFormatters'
import type { ReportFormData, SubjectFormData } from '../../types'

export const useReportLogic = () => {
  const currentPage = ref(1)
  const hasMore = ref(true)
  const searchText = ref('')

  const validateReport = (data: ReportFormData): boolean => {
    return validateReportData(data)
  }

  const validateSubject = (subject: SubjectFormData): boolean => {
    return !!(
      subject.label &&
      subject.priority &&
      subject.description &&
      subject.start_at &&
      subject.end_at
    )
  }

  const canEdit = (reportStatus: string): boolean => {
    return reportStatus === 'draft'
  }

  const canDelete = (reportStatus: string): boolean => {
    return reportStatus === 'draft'
  }

  const incrementPage = () => {
    currentPage.value += 1
  }

  const resetPagination = () => {
    currentPage.value = 1
    hasMore.value = true
  }

  const setHasMore = (lastPage: number) => {
    hasMore.value = currentPage.value < lastPage
  }

  return {
    currentPage,
    hasMore,
    searchText,
    validateReport,
    validateSubject,
    canEdit,
    canDelete,
    incrementPage,
    resetPagination,
    setHasMore,
  }
}
