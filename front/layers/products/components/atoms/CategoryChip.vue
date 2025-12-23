<script setup lang="ts">
interface Props {
  name: string
}

defineProps<Props>()
</script>

<template>
  <v-chip color="info" size="small" variant="tonal">
    {{ name }}
  </v-chip>
</template>
