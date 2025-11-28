import { storeToRefs } from 'pinia'
import { reportService } from '../../services/reportService'
import { useReportStore } from '../../stores/useReport.store'
import type { ReportFormData } from '../../types'

export const useReportConnector = () => {
  const store = useReportStore()

  const fetchReports = async (params?: Record<string, any>) => {
    store.isLoading = true
    store.error = null

    try {
      const response = await reportService.search(params)
      store.reports = response.data
      return response
    }
    catch (error: any) {
      store.error = error.message || 'Erreur lors du chargement des rapports'
      throw error
    }
    finally {
      store.isLoading = false
    }
  }

  const fetchReportById = async (id: number) => {
    store.isLoading = true
    store.error = null

    try {
      const report = await reportService.getById(id)
      store.currentReport = report
      return report
    }
    catch (error: any) {
      store.error = error.message || 'Erreur lors du chargement du rapport'
      throw error
    }
    finally {
      store.isLoading = false
    }
  }

  const createReport = async (data: ReportFormData, isDraft = false) => {
    store.isLoading = true
    store.error = null

    try {
      const response = await reportService.create(data, isDraft)
      await fetchReports()
      return response
    }
    catch (error: any) {
      store.error = error.message || 'Erreur lors de la création du rapport'
      throw error
    }
    finally {
      store.isLoading = false
    }
  }

  const updateReport = async (id: number, data: Partial<ReportFormData>, isDraft = false) => {
    store.isLoading = true
    store.error = null

    try {
      const response = await reportService.update(id, data, isDraft)
      await fetchReports()
      return response
    }
    catch (error: any) {
      store.error = error.message || 'Erreur lors de la mise à jour du rapport'
      throw error
    }
    finally {
      store.isLoading = false
    }
  }

  const deleteReport = async (id: number) => {
    store.isLoading = true
    store.error = null

    try {
      await reportService.delete(id)
      await fetchReports()
    }
    catch (error: any) {
      store.error = error.message || 'Erreur lors de la suppression du rapport'
      throw error
    }
    finally {
      store.isLoading = false
    }
  }

  return {
    fetchReports,
    fetchReportById,
    createReport,
    updateReport,
    deleteReport,
  }
}
