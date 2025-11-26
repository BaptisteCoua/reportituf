<template>
  <v-card class="pa-6" elevation="0" border>
    <ReportPanelTitle :report="report" class="mb-5" />
    <Subjects :subjects="report?.subjects" :reportId="report.id" />
  </v-card>
</template>

<script setup lang="ts">
import auth from "~/middlewares/auth";

const { report } = await usePageReport();

definePageMeta({
  middleware: auth,
});

useHead({
  title: `Rapport #${report.id}`,
});
</script>
