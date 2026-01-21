<script setup lang="ts">
import type { Product } from '../../types'

interface Props {
  product: Product
}

defineProps<Props>()
</script>

<template>
  <div class="d-flex align-center ga-3">
    <ProductImage :src="product.images[0]" :alt="product.title" />
    <div>
      <div class="font-weight-medium">{{ product.title }}</div>
      <div class="text-caption text-medium-emphasis text-truncate" style="max-width: 200px">
        {{ product.description }}
      </div>
    </div>
  </div>
</template>
