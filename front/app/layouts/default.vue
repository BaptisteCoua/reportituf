<script setup lang="ts">
import { Toaster } from "vue3-hot-toast";
const home = useRuntimeConfig().public.home;
const notAtHome = computed(() => useRoute().path !== home);
</script>

<template>
  <Header />
  <div class="content-width">
    <v-btn
      v-if="notAtHome"
      variant="text"
      prependIcon="mdi-arrow-left"
      class="mb-4"
      :to="home"
    >
      Retour aux rapports
    </v-btn>
    <slot />
  </div>
  <Toaster />
</template>

<style scoped>
.content-width {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 16px;
}
</style>
