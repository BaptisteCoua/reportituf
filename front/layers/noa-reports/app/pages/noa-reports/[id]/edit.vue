<template>
  <div class="pa-6">
    <v-btn
      :to="`/noa-reports/${reportId}`"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
    >
      Retour
    </v-btn>

    <v-progress-circular
      v-if="isLoading"
      indeterminate
      class="mx-auto d-block"
    />

    <template v-else-if="currentReport">
      <v-alert
        v-if="!canEdit(currentReport.status.slug)"
        type="error"
        class="mb-4"
      >
        Ce rapport est publié et ne peut plus être modifié
      </v-alert>

      <ReportForm
        v-else
        :report-id="reportId"
        :initial-data="formData"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </template>

    <v-alert v-else type="error">
      Rapport introuvable
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import type { ReportFormData } from '../../../types'

const route = useRoute()
const router = useRouter()
const reportId = Number(route.params.id)

const {
  currentReport,
  isLoading,
  fetchReportById,
  updateReport,
  canEdit,
} = useReportOrchestrator()

const formData = computed(() => ({
  title: currentReport.value?.title || '',
  team: currentReport.value?.team.id || 0,
  shared: currentReport.value?.users.map(u => u.id) || [],
  subjects: currentReport.value?.subjects.map(s => ({
    id: s.id,
    label: s.label,
    priority: s.priority.id,
    stakeholder: s.stakeholder || '',
    description: s.description,
    start_at: s.start_at,
    end_at: s.end_at,
  })) || [],
}))

onMounted(async () => {
  await fetchReportById(reportId)
})

const handleSubmit = async (data: ReportFormData, isDraft: boolean) => {
  try {
    await updateReport(reportId, data, isDraft)
    navigateTo(isDraft ? `/noa-reports/${reportId}/edit` : `/noa-reports/${reportId}`)
  }
  catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  }
}

const handleCancel = () => {
  router.push(`/noa-reports/${reportId}`)
}

definePageMeta({
  title: 'Modifier le rapport',
})
</script>
