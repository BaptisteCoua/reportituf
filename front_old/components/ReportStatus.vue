<template>
  <v-chip :color="color" class="font-weight-bold text-capitalize" small>
    {{ report.status.name }}
  </v-chip>
</template>

<script setup lang="ts">
const props = defineProps<{
  report: { type: IReport; required: true };
}>();

const color = computed(() => {
  switch (props.report.status.slug) {
    case "draft":
      return "#e18700";
    case "sended":
      return "#1ba441";
    default:
      return "#ffe1b3";
  }
});
</script>
