<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Search...'
})

defineEmits<Emits>()
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    :placeholder="placeholder"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="compact"
    hide-details
    clearable
    @update:model-value="$emit('update:modelValue', $event ?? '')"
  />
</template>
