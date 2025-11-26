<template>
  <v-autocomplete
    v-bind="props"
    :model-value="value"
    v-model:search="search"
    @update:model-value="handleSubmit"
    @update:search="debounceSearch"
    :items="itemsWithSelected"
    return-object
  >
    <template v-for="(slotFn, name) in $slots" #[name]="slotProps">
      <component :is="slotFn" v-bind="slotProps" />
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import type { ISearchQuery } from "laravel-rest-api-nuxt-sdk/types/search";
import { makeVAutocompleteProps } from "vuetify/lib/components/VAutocomplete/VAutocomplete.mjs";
const props = defineProps({
  ...makeVAutocompleteProps(),
  itemValue: {
    type: String,
    default: "id",
  },
  resourceName: {
    type: String,
    required: true,
  },
  searchParams: {
    type: Object as PropType<ISearchQuery<any>>,
    default: () => ({}),
  },
});
const search = defineModel("search", {
  default: () => "",
});
const value = defineModel<number | number[]>();
const diff = defineModel<
  | {
      added: any[] | any | null;
      removed: any[] | any | null;
    }
  | undefined
>("diff");

const { itemsWithSelected, debounceSearch, handleSubmit } =
  await useRestApiAutoComplete(props, diff, value);
</script>
