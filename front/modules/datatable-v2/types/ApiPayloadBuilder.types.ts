export interface ServerFetchParams {
  page: number;
  itemsPerPage: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filters?: Record<string, unknown>;
}

export type PayloadBuilderFunction = (params: ServerFetchParams) => unknown;
