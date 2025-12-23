<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  size?: number
}

withDefaults(defineProps<Props>(), {
  alt: 'Product',
  size: 48
})
</script>

<template>
  <v-avatar :size="size" rounded="lg">
    <v-img :src="src" :alt="alt" cover />
  </v-avatar>
</template>
