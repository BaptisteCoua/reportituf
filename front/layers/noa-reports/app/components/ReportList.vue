<template>
  <div class="report-list">
    <v-progress-linear
      v-if="isLoading && reports.length === 0"
      indeterminate
      color="primary"
    />

    <v-expansion-panels
      v-else
      variant="accordion"
      class="mt-4"
    >
      <v-expansion-panel
        v-for="report in reports"
        :key="report.id"
      >
        <v-expansion-panel-title>
          <div class="d-flex justify-space-between align-center w-100 pr-4">
            <div class="d-flex align-center ga-3">
              <ReportStatus :status="report.status" />
              <span class="text-h6">{{ report.title }}</span>
            </div>
            <div class="text-caption text-grey">
              {{ formatDate(report.created_at) }}
            </div>
          </div>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <div class="pa-4">
            <div class="mb-4">
              <v-chip size="small" variant="outlined" class="mr-2">
                <v-icon start>mdi-account-group</v-icon>
                {{ report.team.name }}
              </v-chip>
              <v-chip size="small" variant="outlined">
                <v-icon start>mdi-account</v-icon>
                {{ report.creator.name }}
              </v-chip>
            </div>

            <v-list>
              <v-list-item
                v-for="subject in report.subjects"
                :key="subject.id"
                class="mb-2"
              >
                <v-list-item-title>{{ subject.label }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ subject.description }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <div class="d-flex ga-2 mt-4">
              <v-btn
                :to="`/noa-reports/${report.id}`"
                variant="text"
                color="primary"
                size="small"
              >
                <v-icon start>mdi-eye</v-icon>
                Voir
              </v-btn>
              <v-btn
                v-if="report.status.slug === 'draft'"
                :to="`/noa-reports/${report.id}/edit`"
                variant="text"
                color="warning"
                size="small"
              >
                <v-icon start>mdi-pencil</v-icon>
                Éditer
              </v-btn>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div v-if="hasMore" class="text-center mt-4">
      <v-btn
        @click="emit('loadMore')"
        :loading="isLoading"
        variant="outlined"
      >
        Voir plus
      </v-btn>
    </div>

    <div v-else-if="reports.length > 0" class="text-center text-grey mt-4">
      Aucun rapport supplémentaire
    </div>

    <div v-else-if="!isLoading" class="text-center text-grey mt-8">
      <v-icon size="64" color="grey-lighten-1">mdi-file-document-outline</v-icon>
      <div class="mt-2">Aucun rapport trouvé</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Report } from '../../types'
import { formatDate } from '../../utils/reportFormatters'

defineProps<{
  reports: Report[]
  isLoading: boolean
  hasMore: boolean
}>()

const emit = defineEmits<{
  loadMore: []
}>()
</script>

<style scoped>
.report-list {
  min-height: 400px;
}

:deep(.v-expansion-panel-title__overlay) {
  opacity: 0 !important;
}
</style>
