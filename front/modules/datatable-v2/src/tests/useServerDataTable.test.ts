import { describe, it, expect, beforeEach, vi } from "vitest";
import { useServerDataTable } from "../composables/useServerDataTable";
import type { ServerFetchResponse } from "../types/ServerDataTable.types";
import type { DataTableHeader } from "../types/DataTable.types";

interface TestItem {
  id: number;
  name: string;
  age: number;
}

describe("useServerDataTable", () => {
  let mockFetchFunction: ReturnType<typeof vi.fn>;

  const headers: DataTableHeader[] = [
    { key: "name", title: "Nom", sortable: true },
    { key: "age", title: "Age", sortable: true },
  ];

  const mockItems: TestItem[] = [
    { id: 1, name: "Alice", age: 30 },
    { id: 2, name: "Bob", age: 25 },
    { id: 3, name: "Charlie", age: 35 },
  ];

  const mockResponse: ServerFetchResponse<TestItem> = {
    items: mockItems,
    total: 50,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchFunction = vi.fn().mockResolvedValue(mockResponse);
  });

  describe("initialization", () => {
    it("retourne tous les refs et méthodes attendus", () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      // State refs (hérités de useDataTable)
      expect(table.items).toBeDefined();
      expect(table.headers).toBeDefined();
      expect(table.sort).toBeDefined();
      expect(table.pagination).toBeDefined();
      expect(table.selectedItems).toBeDefined();
      expect(table.isLoading).toBeDefined();
      expect(table.paginatedItems).toBeDefined();
      expect(table.isAllSelected).toBeDefined();
      expect(table.isPageSelected).toBeDefined();
      expect(table.isIndeterminate).toBeDefined();
      expect(table.isPageIndeterminate).toBeDefined();
      expect(table.selectedCount).toBeDefined();
      expect(table.selectedIds).toBeDefined();

      // State refs spécifiques à ServerDataTable
      expect(table.isRefreshing).toBeDefined();
      expect(table.lastUpdate).toBeDefined();
      expect(table.search).toBeDefined();
      expect(table.filters).toBeDefined();

      // Methods (hérités)
      expect(typeof table.setHeaders).toBe("function");
      expect(typeof table.toggleSort).toBe("function");
      expect(typeof table.setSort).toBe("function");
      expect(typeof table.clearSort).toBe("function");
      expect(typeof table.setPage).toBe("function");
      expect(typeof table.nextPage).toBe("function");
      expect(typeof table.previousPage).toBe("function");
      expect(typeof table.goToFirstPage).toBe("function");
      expect(typeof table.goToLastPage).toBe("function");
      expect(typeof table.setItemsPerPage).toBe("function");
      expect(typeof table.selectItem).toBe("function");
      expect(typeof table.selectItems).toBe("function");
      expect(typeof table.deselectItems).toBe("function");
      expect(typeof table.selectAll).toBe("function");
      expect(typeof table.selectPage).toBe("function");
      expect(typeof table.clearSelection).toBe("function");
      expect(typeof table.isSelected).toBe("function");
      expect(typeof table.reset).toBe("function");

      // Methods spécifiques à ServerDataTable
      expect(typeof table.setSearch).toBe("function");
      expect(typeof table.setFilter).toBe("function");
      expect(typeof table.setFilters).toBe("function");
      expect(typeof table.clearFilters).toBe("function");
      expect(typeof table.clearSearch).toBe("function");
      expect(typeof table.fetchItems).toBe("function");
      expect(typeof table.refresh).toBe("function");
      expect(typeof table.cancelFetch).toBe("function");
    });

    it("initialise avec les options fournies", () => {
      const table = useServerDataTable<TestItem>({
        headers,
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      expect(table.headers.value).toEqual(headers);
      expect(table.items.value).toEqual([]);
    });
  });

  describe("fetch operations", () => {
    it("fetchItems appelle la fonction fetch", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      await table.fetchItems();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
      expect(table.items.value).toEqual(mockItems);
    });

    it("met à jour isLoading pendant le fetch", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      expect(table.isLoading.value).toBe(false);

      const fetchPromise = table.fetchItems();
      expect(table.isLoading.value).toBe(true);

      await fetchPromise;
      expect(table.isLoading.value).toBe(false);
    });

    it("met à jour isRefreshing pendant le fetch", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      expect(table.isRefreshing.value).toBe(false);

      const fetchPromise = table.fetchItems();
      expect(table.isRefreshing.value).toBe(true);

      await fetchPromise;
      expect(table.isRefreshing.value).toBe(false);
    });

    it("met à jour lastUpdate après le fetch", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      expect(table.lastUpdate.value).toBeNull();

      await table.fetchItems();

      expect(table.lastUpdate.value).toBeInstanceOf(Date);
    });

    it("refresh rappelle fetchItems", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      await table.fetchItems();
      mockFetchFunction.mockClear();

      await table.refresh();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("cancelFetch annule une requête en cours", async () => {
      let resolvePromise: (value: ServerFetchResponse<TestItem>) => void;
      mockFetchFunction.mockReturnValue(
        new Promise<ServerFetchResponse<TestItem>>((resolve) => {
          resolvePromise = resolve;
        })
      );

      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      const fetchPromise = table.fetchItems();
      table.cancelFetch();

      resolvePromise!(mockResponse);
      await fetchPromise;

      expect(table.isLoading.value).toBe(false);
    });
  });

  describe("search and filters", () => {
    it("setSearch met à jour la recherche", () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      table.setSearch("test", true);

      expect(table.search.value).toBe("test");
    });

    it("setFilter ajoute un filtre", () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      table.setFilter("status", "active");

      expect(table.filters.value).toEqual({ status: "active" });
    });

    it("setFilters remplace les filtres", () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      table.setFilter("status", "active");
      table.setFilters({ role: "admin" });

      expect(table.filters.value).toEqual({ role: "admin" });
    });

    it("clearFilters efface les filtres", () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      table.setFilter("status", "active");
      table.clearFilters();

      expect(table.filters.value).toEqual({});
    });

    it("clearSearch efface la recherche", () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      table.setSearch("test", true);
      table.clearSearch();

      expect(table.search.value).toBe("");
    });
  });

  describe("sorting (server-side)", () => {
    it("toggleSort déclenche un fetch", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      await table.toggleSort("name");

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
      expect(table.sort.value).toEqual({ key: "name", order: "asc" });
    });

    it("setSort déclenche un fetch", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      await table.setSort("age", "desc");

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("clearSort déclenche un fetch", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      await table.setSort("name", "asc");
      mockFetchFunction.mockClear();

      await table.clearSort();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe("pagination (server-side)", () => {
    it("setPage déclenche un fetch", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      await table.setPage(2);

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("setItemsPerPage déclenche un fetch", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      await table.setItemsPerPage(25);

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe("selection", () => {
    it("selectItem fonctionne avec les items fetchés", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      await table.fetchItems();
      table.selectItem(mockItems[0]);

      expect(table.selectedItems.value).toContainEqual(mockItems[0]);
    });

    it("selectAll sélectionne tous les items", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      await table.fetchItems();
      table.selectAll();

      expect(table.selectedItems.value.length).toBe(3);
    });

    it("isSelected retourne le bon état", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      await table.fetchItems();
      table.selectItem(mockItems[0]);

      expect(table.isSelected(mockItems[0])).toBe(true);
      expect(table.isSelected(mockItems[1])).toBe(false);
    });
  });

  describe("reset", () => {
    it("reset réinitialise tout l'état", async () => {
      const table = useServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
        autoFetch: false,
      });

      await table.fetchItems();
      table.selectAll();
      await table.setSort("name", "desc");
      table.setSearch("test", true);
      table.setFilter("status", "active");

      table.reset();

      expect(table.items.value).toEqual([]);
      expect(table.selectedItems.value).toEqual([]);
      expect(table.sort.value).toBeNull();
      expect(table.search.value).toBe("");
      expect(table.filters.value).toEqual({});
      expect(table.lastUpdate.value).toBeNull();
    });
  });

  describe("methods binding", () => {
    it("les méthodes fonctionnent après destructuration", async () => {
      const { fetchItems, items, selectItem, isSelected } =
        useServerDataTable<TestItem>({
          fetchFunction: mockFetchFunction,
          autoFetch: false,
        });

      await fetchItems();
      expect(items.value).toEqual(mockItems);

      selectItem(mockItems[0]);
      expect(isSelected(mockItems[0])).toBe(true);
    });
  });
});
