<template>
  <div class="pa-6">
    <v-btn
      to="/noa-reports"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
    >
      Retour
    </v-btn>

    <ReportForm
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import type { ReportFormData } from '../../types'

const router = useRouter()
const { createReport } = useReportOrchestrator()

const handleSubmit = async (data: ReportFormData, isDraft: boolean) => {
  try {
    const response = await createReport(data, isDraft)
    const reportId = response.created[0]

    navigateTo(isDraft ? `/noa-reports/${reportId}/edit` : `/noa-reports/${reportId}`)
  }
  catch (error) {
    console.error('Erreur lors de la création:', error)
  }
}

const handleCancel = () => {
  router.push('/noa-reports')
}

definePageMeta({
  title: 'Nouveau rapport',
})
</script>
