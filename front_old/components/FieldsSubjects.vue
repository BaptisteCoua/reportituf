<template>
  <v-card class="pa-6" elevation="0" border>
    <v-row>
      <v-col cols="2">
        <v-text-field
          v-model="data.label"
          label="Sujet"
          :rules="[rules.required('Veuillez entrer le Sujet')]"
          v-bind="commonProps"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="data.priority"
          :items="priorities"
          item-title="name"
          :rules="[
            rules.required('Veuillez sélectionner au moins un Priorité'),
          ]"
          item-value="id"
          label="Priorité"
          v-bind="commonProps"
        />
      </v-col>
      <v-col cols="2">
        <v-date-input
          v-model="data.dates"
          label="Dates"
          clearable
          multiple="range"
          prepend-icon=""
          prepend-inner-icon="mdi-calendar"
          required
          v-bind="commonProps"
          @update:model-value="(values) => range(values)"
        />
      </v-col>

      <v-col cols="2">
        <v-text-field
          v-model="data.stakeholder"
          label="Parties Prenantes"
          v-bind="commonProps"
        />
      </v-col>
      <v-col cols="4" class="d-flex justify-end align-center">
        <v-icon variant="text" @click="remove"> mdi-delete </v-icon>
      </v-col>
      <v-col cols="12">
        <Editor v-model="data.description" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { useRules } from "vuetify/labs/rules";
const commonProps = {
  density: "compact",
  "hide-details": "auto",
  variant: "outlined",
} as const;

const rules = useRules();

const priorities = (await usePriorities().search()).data;
const data = defineModel<Record<string, any>>({ required: true });
const fields = ref<Record<string, any>>({ ...data.value });
watch(fields, () => (data.value = { ...fields.value }), { deep: true });

const range = (values: string[]) => {
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
  if (!values.length) {
    data.value.start_at = null;
    data.value.end_at = null;
    return;
  }
  data.value.start_at = toIsoStringWithTimezone(new Date(values[0]));
  if (
    values.length > 1 &&
    !isSameDay(new Date(values[0]), new Date(values[values.length - 1]))
  ) {
    data.value.end_at = toIsoStringWithTimezone(
      new Date(values[values.length - 1])
    );
  } else {
    data.value.end_at = null;
  }
};

const emits = defineEmits(["remove"]);
const remove = () => emits("remove");
</script>
