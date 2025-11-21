<template>
  <section class="d-flex align-center flex-wrap ga-4 justify-space-between">
    <div class="search-wrapper d-flex pa-1 pl-4 pb-1">
      <v-text-field
        v-model="search"
        placeholder="Rechercher un rapport "
        prepend-inner-icon="mdi-magnify"
        class="search-input"
        v-bind="commonProps"
        @keydown.enter.prevent="emits('search', search)"
      />
    </div>
    <div class="filter d-flex align-center ga-4">
      <v-select
        v-model="filters.status"
        placeholder="Statut"
        :items="status.data"
        item-title="name"
        item-value="id"
        clearable
        class="filter-select"
        v-bind="commonProps"
      />
      <rest-api-autocomplete
        resource-name="teams"
        v-model="filters.team"
        placeholder="Equipe"
        clearable
        item-title="name"
        item-value="id"
        class="filter-select"
        v-bind="commonProps"
      />
      <rest-api-autocomplete
        resource-name="users"
        v-model="filters.reporter"
        item-title="name"
        item-value="id"
        clearable
        placeholder="Rapporteur"
        class="filter-select"
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
      <v-date-input
        v-model="filters.date"
        label="Dates"
        clearable
        prepend-icon=""
        prepend-inner-icon="$calendar"
        class="filter-select"
        v-bind="commonProps"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
const commonProps = {
  density: "comfortable",
  "hide-details": true,
  variant: "outlined",
} as const;

const filters = ref<Record<string, any>>({});
const search = ref<string>("");
const status = await useStatus().search();
const emits = defineEmits(["search", "filters"]);

watch(
  filters,
  () => {
    emits("filters", filters.value);
  },
  { deep: true }
);
</script>

<style lang="css" scoped>
.search-wrapper {
  width: 400px;
}

.filter-select {
  width: 150px;
}
</style>
