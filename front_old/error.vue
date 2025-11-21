<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
  error: Object as () => NuxtError,
});
const { home } = useRuntimeConfig().public;
</script>

<template>
  <Header />
  <div class="content-width">
    <div
      class="d-flex flex-column justify-center align-center error-content ga-3"
    >
      <h1 class="text-h1 font-weight-bold letter-spacing">
        {{ error.statusCode }}
      </h1>
      <h4>{{ error.message }}</h4>
      <v-btn variant="flat" color="xefi-red" :to="home">Go back home</v-btn>
    </div>
  </div>
</template>

<style scoped>
.error-content {
  height: var(--full-height-minus-nav);
}
.letter-spacing {
  letter-spacing: 2px !important;
}
</style>
