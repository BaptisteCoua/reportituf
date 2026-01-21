<script setup lang="ts">
interface Props {
  search: string
  role: 'customer' | 'admin' | null
}

interface Emits {
  (e: 'update:search', value: string): void
  (e: 'update:role', value: 'customer' | 'admin' | null): void
}

defineProps<Props>()
defineEmits<Emits>()

const roleOptions = [
  { title: 'All', value: null },
  { title: 'Admin', value: 'admin' },
  { title: 'Customer', value: 'customer' }
]
</script>

<template>
  <div class="d-flex align-center ga-4">
    <UserSearchInput
      :model-value="search"
      placeholder="Search users..."
      class="flex-grow-1"
      style="max-width: 400px"
      @update:model-value="$emit('update:search', $event)"
    />
    <v-select
      :model-value="role"
      :items="roleOptions"
      label="Role"
      variant="outlined"
      density="compact"
      hide-details
      style="max-width: 150px"
      @update:model-value="$emit('update:role', $event)"
    />
  </div>
</template>
