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

    <v-progress-circular
      v-if="isLoading"
      indeterminate
      class="mx-auto d-block"
    />

    <v-card v-else-if="currentReport" flat border class="pa-6">
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 mb-2">{{ currentReport.title }}</h1>
          <ReportStatus :status="currentReport.status" />
        </div>

        <v-btn
          v-if="canEdit(currentReport.status.slug)"
          :to="`/noa-reports/${currentReport.id}/edit`"
          color="warning"
          prepend-icon="mdi-pencil"
        >
          Éditer
        </v-btn>
      </div>

      <v-divider class="my-6" />

      <div class="mb-6">
        <v-chip size="small" variant="outlined" class="mr-2">
          <v-icon start>mdi-account-group</v-icon>
          {{ currentReport.team.name }}
        </v-chip>
        <v-chip size="small" variant="outlined">
          <v-icon start>mdi-account</v-icon>
          {{ currentReport.creator.name }}
        </v-chip>
      </div>

      <v-divider class="my-6" />

      <h2 class="text-h5 mb-4">Sujets</h2>

      <v-card
        v-for="subject in currentReport.subjects"
        :key="subject.id"
        flat
        border
        class="mb-4 pa-4"
      >
        <div class="d-flex justify-space-between align-center mb-2">
          <h3 class="text-h6">{{ subject.label }}</h3>
          <v-chip size="small" :color="getPriorityColor(subject.priority.id)">
            {{ subject.priority.name }}
          </v-chip>
        </div>

        <p class="mb-2">{{ subject.description }}</p>

        <div class="text-caption text-grey">
          <v-icon size="small">mdi-calendar</v-icon>
          {{ formatDate(subject.start_at) }} - {{ formatDate(subject.end_at) }}
        </div>

        <div v-if="subject.stakeholder" class="text-caption text-grey mt-1">
          <v-icon size="small">mdi-account</v-icon>
          {{ subject.stakeholder }}
        </div>
      </v-card>
    </v-card>

    <v-alert v-else type="error">
      Rapport introuvable
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '../../../utils/reportFormatters'

const route = useRoute()
const reportId = Number(route.params.id)

const {
  currentReport,
  isLoading,
  fetchReportById,
  canEdit,
} = useReportOrchestrator()

onMounted(async () => {
  await fetchReportById(reportId)
})

const getPriorityColor = (priorityId: number) => {
  switch (priorityId) {
    case 1:
      return 'success'
    case 2:
      return 'warning'
    case 3:
      return 'error'
    default:
      return 'info'
  }
}

definePageMeta({
  title: 'Détail du rapport',
})
</script>
