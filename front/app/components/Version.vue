<template>
  <div
    class="position-fixed pa-4 bottom-0 left-0 text-body-1 opacity-30 poppins"
    style="color: gray"
  >
    v{{ version }}
  </div>
</template>

<script setup lang="ts">
const { version } = useRuntimeConfig().public;
</script>
