<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  size?: number
}

withDefaults(defineProps<Props>(), {
  alt: 'Avatar',
  size: 40
})
</script>

<template>
  <v-avatar :size="size">
    <v-img :src="src" :alt="alt" cover />
  </v-avatar>
</template>
