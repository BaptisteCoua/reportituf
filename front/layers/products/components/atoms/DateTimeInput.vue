<script setup lang="ts">
interface Props {
  modelValue: string | null
  label: string
  error?: string | null
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :error-messages="error || undefined"
    type="datetime-local"
    variant="outlined"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
