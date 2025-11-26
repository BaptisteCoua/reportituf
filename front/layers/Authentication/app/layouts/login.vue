<template>
  <div class="page-wrapper d-flex flex-column align-center justify-center">
    <slot />
  </div>
</template>

<style scoped>
.page-wrapper {
  background: linear-gradient(0deg, #e10600 0%, #000000 100%),
    linear-gradient(0deg, rgba(90, 90, 90, 0.31), rgba(90, 90, 90, 0.31));
  min-height: 100vh;
}
</style>
