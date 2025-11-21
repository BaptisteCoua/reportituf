<template>
  <ReportFilters @search="searchByText" @filters="searchByFilters" />
  <Reports :additionalSearchParams="searchQuery" />
</template>

<script setup lang="ts">
import auth from "~/middlewares/auth";

definePageMeta({
  middleware: auth,
});

useHead({
  title: "Rapports",
});

const searchQuery = ref({});

const searchByFilters = (filters: Record<string, any>) => {
  const formattedFilters = [];
  if (filters.status) {
    formattedFilters.push({
      field: "status.id",
      value: filters.status,
    });
  }
  if (filters.team) {
    formattedFilters.push({
      field: "team.id",
      value: filters.team,
    });
  }
  if (filters.reporter) {
    formattedFilters.push({
      field: "creator.id",
      value: filters.reporter,
    });
  }

  if (filters.date) {
    const date = new Date(filters.date);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    formattedFilters.push({
      field: "created_at",
      operator: ">=",
      value: toIsoStringWithTimezone(date).split("T")[0],
    });
    formattedFilters.push({
      field: "created_at",
      operator: "<",
      value: toIsoStringWithTimezone(nextDate).split("T")[0],
    });
  }

  searchQuery.value = {
    filters: formattedFilters,
  };
};

const searchByText = (text: string) => {
  searchQuery.value = {
    ...(text
      ? {
          text: {
            value: text,
          },
        }
      : {}),
  };
};
</script>
