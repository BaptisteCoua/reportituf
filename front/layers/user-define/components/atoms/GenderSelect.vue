<template>
  <v-select
    :model-value="modelValue"
    :items="genderOptions"
    label="Genre"
    variant="outlined"
    density="compact"
    hide-details
    clearable
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | undefined
}>()

defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const genderOptions = [
  { title: 'Homme', value: 'male' },
  { title: 'Femme', value: 'female' }
]
</script>
