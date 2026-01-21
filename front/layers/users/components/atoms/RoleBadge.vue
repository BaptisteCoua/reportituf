<script setup lang="ts">
interface Props {
  role: 'customer' | 'admin'
}

const props = defineProps<Props>()

const color = computed(() => props.role === 'admin' ? 'primary' : 'secondary')
const label = computed(() => props.role === 'admin' ? 'Admin' : 'Customer')
</script>

<template>
  <v-chip :color="color" size="small" variant="flat">
    {{ label }}
  </v-chip>
</template>
