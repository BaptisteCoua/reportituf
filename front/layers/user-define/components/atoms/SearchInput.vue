<template>
  <v-text-field
    :model-value="modelValue"
    label="Rechercher"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="compact"
    hide-details
    clearable
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
