import { defineStore } from 'pinia'
import type { Report } from '../types'

export const useReportStore = defineStore('reports', () => {
 
  const reports = ref<Report[]>([])
  const currentReport = ref<Report | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const totalCount = computed(() => reports.value.length)

  const draftReports = computed(() =>
    reports.value.filter((r) => r.status.slug === 'draft'),
  )

  const publishedReports = computed(() =>
    reports.value.filter((r) => r.status.slug === 'published'),
  )

  const reportsByTeam = computed(() => {
    const grouped = new Map<number, Report[]>()
    for (const report of reports.value) {
      const teamId = report.team.id
      if (!grouped.has(teamId)) {
        grouped.set(teamId, [])
      }
      grouped.get(teamId)!.push(report)
    }
    return grouped
  })

 return {
    // State
    reports,
    currentReport,
    isLoading,
    error,

    // Getters
    totalCount,
    draftReports,
    publishedReports,
    reportsByTeam,
  }
})