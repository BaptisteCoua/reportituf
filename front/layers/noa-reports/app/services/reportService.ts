import type { Report, ReportFormData } from "../types";

export const reportService = {
  search: (params?: Record<string, any>) =>
    $fetch<{ data: Report[]; current_page: number; last_page: number }>(
      "/api/reports",
      {
        method: "GET",
        params,
      }
    ),

  getById: (id: number) => $fetch<Report>(`/api/reports/${id}`),

  create: (data: ReportFormData, isDraft = false) =>
    $fetch<{ created: number[] }>("/api/reports", {
      method: "POST",
      body: {
        ...data,
        status: isDraft ? "draft" : "published",
      },
    }),

  update: (id: number, data: Partial<ReportFormData>, isDraft = false) =>
    $fetch<{ updated: number[] }>(`/api/reports/${id}`, {
      method: "PUT",
      body: {
        ...data,
        status: isDraft ? "draft" : "published",
      },
    }),

  delete: (id: number) =>
    $fetch(`/api/reports/${id}`, {
      method: "DELETE",
    }),
};
