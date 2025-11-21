<template>
  <v-row class="text-gray">
    <v-col cols="3">
      <rest-api-combobox
        resource-name="teams"
        v-model="fields.team"
        label="Équipe"
        item-title="name"
        item-value="id"
        :rules="[rules.required('Requis')]"
        class="font-medium"
        prepend-inner-icon="mdi-account-group"
        v-bind="commonProps"
        :return-object="false"
      />
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="Titre du rapport"
        :rules="[rules.required('Veuillez entrer un titre')]"
        class="font-medium"
        v-model="fields.title"
        v-bind="commonProps"
      />
    </v-col>
    <v-col cols="3">
      <rest-api-autocomplete
        id="sharedUsers"
        v-model="fields.shared"
        v-model:diff="fields.sharedDiff"
        resource-name="users"
        item-title="name"
        item-value="id"
        prepend-inner-icon="mdi-account-multiple-outline"
        label="Partage du Rapport à d'autres collaborateurs"
        :rules="[
          rules.required('Veuillez sélectionner au moins un utilisateur'),
          rules.minLength(1, 'Veuillez sélectionner au moins un utilisateur'),
        ]"
        chips
        closable-chips
        hide-selected
        multiple
        class="font-medium autocomplete-padding"
        v-bind="commonProps"
      >
        <template v-slot:chip="{ props, item }">
          <v-chip
            :color="numberToColor(item.raw.id)"
            v-bind="props"
            :text="item.raw.name"
          />
        </template>
      </rest-api-autocomplete>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useRules } from "vuetify/labs/rules";

const rules = useRules();

const data = defineModel<Record<string, any>>({ required: true });
const fields = ref<Record<string, any>>({ ...data.value });

const commonProps = {
  "hide-details": "auto" as const,
  density: "comfortable" as const,
  variant: "outlined" as const,
  clearable: true,
};

watch(fields, () => (data.value = { ...fields.value }), { deep: true });

defineExpose({
  fields,
});
</script>
