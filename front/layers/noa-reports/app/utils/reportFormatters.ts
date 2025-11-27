import type { ReportFilters } from "../types";

export const formatFiltersToApiParams = (filters: ReportFilters) => {
  const apiFilters: Array<{ field: string; operator?: string; value: any }> =
    [];

  if (filters.status) {
    apiFilters.push({
      field: "status.id",
      value: filters.status,
    });
  }

  if (filters.team) {
    apiFilters.push({
      field: "team.id",
      value: filters.team,
    });
  }

  if (filters.reporter) {
    apiFilters.push({
      field: "creator.id",
      value: filters.reporter,
    });
  }

  if (filters.date) {
    const date = new Date(filters.date);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    apiFilters.push({
      field: "created_at",
      operator: ">=",
      value: date.toISOString().split("T")[0],
    });
    apiFilters.push({
      field: "created_at",
      operator: "<",
      value: nextDate.toISOString().split("T")[0],
    });
  }

  return {
    filters: apiFilters,
    ...(filters.text ? { text: { value: filters.text } } : {}),
  };
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const validateReportData = (data: any): boolean => {
  return !!(
    data.title &&
    data.team &&
    data.subjects &&
    data.subjects.length > 0
  );
};
