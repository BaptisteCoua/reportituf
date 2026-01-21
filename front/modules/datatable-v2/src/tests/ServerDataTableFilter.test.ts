import { describe, it, expect, beforeEach, vi } from "vitest";
import { ServerDataTableFilter } from "../handlers/ServerDataTableFilter";
import { ServerDataTableFetcher } from "../handlers/ServerDataTableFetcher";
import { ServerDataTableState } from "../state/ServerDataTableState";
import type { ServerFetchResponse } from "../types/ServerDataTable.types";

interface TestItem {
  id: number;
  name: string;
}

describe("ServerDataTableFilter", () => {
  let filter: ServerDataTableFilter<TestItem>;
  let fetcher: ServerDataTableFetcher<TestItem>;
  let state: ServerDataTableState<TestItem>;
  let mockFetchFunction: ReturnType<typeof vi.fn>;

  const mockResponse: ServerFetchResponse<TestItem> = {
    items: [{ id: 1, name: "Alice" }],
    total: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockFetchFunction = vi.fn().mockResolvedValue(mockResponse);

    state = new ServerDataTableState<TestItem>({
      fetchFunction: mockFetchFunction,
    });

    fetcher = new ServerDataTableFetcher<TestItem>(state);
    filter = new ServerDataTableFilter<TestItem>(state, fetcher, 300);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("setSearch", () => {
    it("met à jour la recherche dans le state", () => {
      filter.setSearch("test");

      expect(state.getFilters().value.search).toBe("test");
    });

    it("applique un debounce par défaut", () => {
      filter.setSearch("test");

      expect(mockFetchFunction).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("réinitialise la page à 1 après le debounce", () => {
      state.setPagination({ page: 5 });
      filter.setSearch("test");

      vi.advanceTimersByTime(300);

      expect(state.getPagination().value.page).toBe(1);
    });

    it("immediate=true désactive le debounce", () => {
      filter.setSearch("test", true);

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("immediate=true réinitialise la page immédiatement", () => {
      state.setPagination({ page: 5 });
      filter.setSearch("test", true);

      expect(state.getPagination().value.page).toBe(1);
    });

    it("annule le debounce précédent lors d'une nouvelle recherche", () => {
      filter.setSearch("test1");
      vi.advanceTimersByTime(200);
      filter.setSearch("test2");
      vi.advanceTimersByTime(200);

      expect(mockFetchFunction).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
      expect(state.getFilters().value.search).toBe("test2");
    });

    it("utilise le debounceMs personnalisé", () => {
      const customFilter = new ServerDataTableFilter<TestItem>(state, fetcher, 500);

      customFilter.setSearch("test");
      vi.advanceTimersByTime(300);

      expect(mockFetchFunction).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe("setFilter", () => {
    it("ajoute un filtre au state", () => {
      filter.setFilter("status", "active");

      expect(state.getFilters().value.filters).toEqual({ status: "active" });
    });

    it("déclenche un fetch immédiatement", () => {
      filter.setFilter("status", "active");

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("réinitialise la page à 1", () => {
      state.setPagination({ page: 5 });
      filter.setFilter("status", "active");

      expect(state.getPagination().value.page).toBe(1);
    });

    it("permet d'ajouter plusieurs filtres", () => {
      filter.setFilter("status", "active");
      filter.setFilter("role", "admin");

      expect(state.getFilters().value.filters).toEqual({
        status: "active",
        role: "admin",
      });
    });

    it("écrase un filtre existant", () => {
      filter.setFilter("status", "active");
      filter.setFilter("status", "inactive");

      expect(state.getFilters().value.filters).toEqual({ status: "inactive" });
    });
  });

  describe("setFilters", () => {
    it("remplace tous les filtres", () => {
      filter.setFilter("status", "active");
      filter.setFilters({ role: "admin", type: "user" });

      expect(state.getFilters().value.filters).toEqual({
        role: "admin",
        type: "user",
      });
    });

    it("déclenche un fetch immédiatement", () => {
      filter.setFilters({ status: "active" });

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("réinitialise la page à 1", () => {
      state.setPagination({ page: 5 });
      filter.setFilters({ status: "active" });

      expect(state.getPagination().value.page).toBe(1);
    });
  });

  describe("clearFilters", () => {
    it("efface tous les filtres et la recherche", () => {
      filter.setSearch("test", true);
      filter.setFilter("status", "active");
      mockFetchFunction.mockClear();

      filter.clearFilters();

      expect(state.getFilters().value).toEqual({
        search: "",
        filters: {},
      });
    });

    it("déclenche un fetch", () => {
      filter.setFilter("status", "active");
      mockFetchFunction.mockClear();

      filter.clearFilters();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("réinitialise la page à 1", () => {
      state.setPagination({ page: 5 });
      filter.clearFilters();

      expect(state.getPagination().value.page).toBe(1);
    });
  });

  describe("clearSearch", () => {
    it("efface uniquement la recherche", () => {
      filter.setSearch("test", true);
      filter.setFilter("status", "active");
      mockFetchFunction.mockClear();

      filter.clearSearch();

      expect(state.getFilters().value.search).toBe("");
      expect(state.getFilters().value.filters).toEqual({ status: "active" });
    });

    it("déclenche un fetch immédiat", () => {
      filter.setSearch("test", true);
      mockFetchFunction.mockClear();

      filter.clearSearch();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe("getSearch", () => {
    it("retourne un computed de la recherche", () => {
      const search = filter.getSearch();

      expect(search.value).toBe("");

      filter.setSearch("test", true);

      expect(search.value).toBe("test");
    });
  });

  describe("getFilters", () => {
    it("retourne un computed des filtres", () => {
      const filters = filter.getFilters();

      expect(filters.value).toEqual({});

      filter.setFilter("status", "active");

      expect(filters.value).toEqual({ status: "active" });
    });
  });

  describe("default debounce", () => {
    it("utilise 300ms par défaut", () => {
      const defaultFilter = new ServerDataTableFilter<TestItem>(state, fetcher);

      defaultFilter.setSearch("test");
      vi.advanceTimersByTime(299);

      expect(mockFetchFunction).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });
  });
});
