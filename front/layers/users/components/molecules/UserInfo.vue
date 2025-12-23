<script setup lang="ts">
import type { User } from '../../types'

interface Props {
  user: User
}

defineProps<Props>()
</script>

<template>
  <div class="d-flex align-center ga-3">
    <UserAvatar :src="user.avatar" :alt="user.name" />
    <div>
      <div class="font-weight-medium">{{ user.name }}</div>
      <div class="text-caption text-medium-emphasis">{{ user.email }}</div>
    </div>
  </div>
</template>
