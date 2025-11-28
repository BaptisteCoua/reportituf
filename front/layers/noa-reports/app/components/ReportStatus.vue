<template>
  <v-chip
    :color="statusColor"
    size="small"
    variant="flat"
  >
    {{ statusText }}
  </v-chip>
</template>

<script setup lang="ts">
import type { ReportStatus } from '../../types'

const props = defineProps<{
  status: ReportStatus
}>()

const statusColor = computed(() => {
  switch (props.status.slug) {
    case 'draft':
      return 'warning'
    case 'published':
      return 'success'
    case 'archived':
      return 'grey'
    default:
      return 'info'
  }
})

const statusText = computed(() => props.status.name)
</script>
