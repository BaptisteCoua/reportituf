<script setup lang="ts">
interface Props {
  price: number
  currency?: string
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'USD'
})

const formatted = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.currency
  }).format(props.price)
})
</script>

<template>
  <v-chip color="success" size="small" variant="flat">
    {{ formatted }}
  </v-chip>
</template>
