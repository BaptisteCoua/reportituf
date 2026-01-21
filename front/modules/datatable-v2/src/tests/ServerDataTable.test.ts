import { describe, it, expect, beforeEach, vi } from "vitest";
import { ServerDataTable } from "../ServerDataTable";
import type { ServerFetchResponse, ServerDataTableOptions } from "../types/ServerDataTable.types";
import type { DataTableHeader } from "../types/DataTable.types";

interface TestItem {
  id: number;
  name: string;
  email: string;
  age: number;
}

describe("ServerDataTable", () => {
  let table: ServerDataTable<TestItem>;
  let mockFetchFunction: ReturnType<typeof vi.fn>;

  const headers: DataTableHeader[] = [
    { key: "name", title: "Nom", sortable: true },
    { key: "email", title: "Email", sortable: true },
    { key: "age", title: "Age", sortable: true },
  ];

  const mockItems: TestItem[] = [
    { id: 1, name: "Alice", email: "alice@test.com", age: 30 },
    { id: 2, name: "Bob", email: "bob@test.com", age: 25 },
    { id: 3, name: "Charlie", email: "charlie@test.com", age: 35 },
  ];

  const mockResponse: ServerFetchResponse<TestItem> = {
    items: mockItems,
    total: 10,
  };

  const createTable = (options: Partial<ServerDataTableOptions<TestItem>> = {}) => {
    mockFetchFunction = vi.fn().mockResolvedValue(mockResponse);
    return new ServerDataTable<TestItem>({
      headers,
      fetchFunction: mockFetchFunction,
      autoFetch: false,
      ...options,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    table = createTable();
  });

  describe("initialization", () => {
    it("initialise avec les options fournies", () => {
      expect(table.getHeaders().value).toEqual(headers);
      expect(table.getItems().value).toEqual([]);
    });

    it("autoFetch appelle fetchItems au démarrage", async () => {
      const autoFetchTable = createTable({ autoFetch: true });
      await vi.waitFor(() => {
        expect(mockFetchFunction).toHaveBeenCalledTimes(1);
      });
    });

    it("autoFetch est activé par défaut", async () => {
      mockFetchFunction = vi.fn().mockResolvedValue(mockResponse);
      new ServerDataTable<TestItem>({
        fetchFunction: mockFetchFunction,
      });
      await vi.waitFor(() => {
        expect(mockFetchFunction).toHaveBeenCalled();
      });
    });

    it("initialise avec un payloadBuilder personnalisé", async () => {
      const customPayloadBuilder = vi.fn().mockReturnValue({ custom: true });
      const customTable = createTable({
        payloadBuilder: customPayloadBuilder,
        autoFetch: false,
      });

      await customTable.fetchItems();
      expect(customPayloadBuilder).toHaveBeenCalled();
    });
  });

  describe("fetchItems", () => {
    it("appelle la fonction fetch et met à jour les items", async () => {
      await table.fetchItems();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
      expect(table.getItems().value).toEqual(mockItems);
    });

    it("met à jour le total des items", async () => {
      await table.fetchItems();

      expect(table.getPagination().value.totalItems).toBe(10);
    });

    it("met à jour lastUpdate après un fetch", async () => {
      expect(table.getLastUpdate().value).toBeNull();

      await table.fetchItems();

      expect(table.getLastUpdate().value).toBeInstanceOf(Date);
    });

    it("gère l'état isLoading pendant le fetch", async () => {
      expect(table.getIsLoading().value).toBe(false);

      const fetchPromise = table.fetchItems();
      expect(table.getIsLoading().value).toBe(true);

      await fetchPromise;
      expect(table.getIsLoading().value).toBe(false);
    });

    it("gère l'état isRefreshing pendant le fetch", async () => {
      expect(table.getIsRefreshing().value).toBe(false);

      const fetchPromise = table.fetchItems();
      expect(table.getIsRefreshing().value).toBe(true);

      await fetchPromise;
      expect(table.getIsRefreshing().value).toBe(false);
    });
  });

  describe("sorting (server-side)", () => {
    it("toggleSort déclenche un fetch", async () => {
      await table.toggleSort("name");

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
      expect(table.getSort().value).toEqual({ key: "name", order: "asc" });
    });

    it("setSort déclenche un fetch", async () => {
      await table.setSort("age", "desc");

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
      expect(table.getSort().value).toEqual({ key: "age", order: "desc" });
    });

    it("clearSort déclenche un fetch", async () => {
      await table.setSort("name", "asc");
      mockFetchFunction.mockClear();

      await table.clearSort();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
      expect(table.getSort().value).toBeNull();
    });

    it("inclut les paramètres de tri dans le payload", async () => {
      await table.setSort("name", "desc");

      const callArg = mockFetchFunction.mock.calls[0][0];
      expect(callArg.sort_by).toBe("name");
      expect(callArg.sort_order).toBe("desc");
    });
  });

  describe("pagination (server-side)", () => {
    it("setPage déclenche un fetch", async () => {
      // First fetch to have totalItems > 0
      mockFetchFunction.mockResolvedValue({ items: mockItems, total: 100 });
      await table.fetchItems();
      mockFetchFunction.mockClear();

      await table.setPage(2);

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
      expect(table.getPagination().value.page).toBe(2);
    });

    it("nextPage déclenche un fetch", async () => {
      mockFetchFunction.mockResolvedValue({ items: mockItems, total: 100 });
      await table.fetchItems();
      mockFetchFunction.mockClear();

      await table.nextPage();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("previousPage déclenche un fetch", async () => {
      await table.setPage(3);
      mockFetchFunction.mockClear();

      await table.previousPage();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("goToFirstPage déclenche un fetch", async () => {
      await table.setPage(3);
      mockFetchFunction.mockClear();

      await table.goToFirstPage();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("goToLastPage déclenche un fetch", async () => {
      mockFetchFunction.mockResolvedValue({ items: mockItems, total: 100 });
      await table.fetchItems();
      mockFetchFunction.mockClear();

      await table.goToLastPage();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("setItemsPerPage déclenche un fetch et reset la page", async () => {
      await table.setPage(3);
      mockFetchFunction.mockClear();

      await table.setItemsPerPage(25);

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
      expect(table.getPagination().value.itemsPerPage).toBe(25);
      expect(table.getPagination().value.page).toBe(1);
    });

    it("inclut les paramètres de pagination dans le payload", async () => {
      // First fetch to have totalItems > 0
      mockFetchFunction.mockResolvedValue({ items: mockItems, total: 100 });
      await table.fetchItems();
      mockFetchFunction.mockClear();

      await table.setPage(2);

      const callArg = mockFetchFunction.mock.calls[0][0];
      expect(callArg.page).toBe(2);
      expect(callArg.per_page).toBe(10);
    });
  });

  describe("search and filters", () => {
    it("setSearch met à jour la recherche", () => {
      table.setSearch("test");

      expect(table.getSearch().value).toBe("test");
    });

    it("setFilter ajoute un filtre", () => {
      table.setFilter("status", "active");

      expect(table.getFilters().value).toEqual({ status: "active" });
    });

    it("setFilters remplace tous les filtres", () => {
      table.setFilter("status", "active");
      table.setFilters({ role: "admin", type: "user" });

      expect(table.getFilters().value).toEqual({ role: "admin", type: "user" });
    });

    it("clearFilters efface tous les filtres", () => {
      table.setFilter("status", "active");
      table.clearFilters();

      expect(table.getFilters().value).toEqual({});
    });

    it("clearSearch efface la recherche", () => {
      table.setSearch("test");
      table.clearSearch();

      expect(table.getSearch().value).toBe("");
    });
  });

  describe("refresh", () => {
    it("refresh rappelle fetchItems avec les derniers paramètres", async () => {
      await table.fetchItems();
      mockFetchFunction.mockClear();

      await table.refresh();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe("cancelFetch", () => {
    it("cancelFetch annule une requête en cours", async () => {
      let resolvePromise: (value: ServerFetchResponse<TestItem>) => void;
      mockFetchFunction.mockReturnValue(
        new Promise<ServerFetchResponse<TestItem>>((resolve) => {
          resolvePromise = resolve;
        })
      );

      const fetchPromise = table.fetchItems();
      table.cancelFetch();

      resolvePromise!(mockResponse);
      await fetchPromise;

      expect(table.getIsLoading().value).toBe(false);
    });
  });

  describe("selection (inherited)", () => {
    it("selectItem fonctionne correctement", async () => {
      await table.fetchItems();

      table.selectItem(mockItems[0]);

      expect(table.getSelectedItems().value).toContainEqual(mockItems[0]);
    });

    it("selectAll sélectionne tous les items", async () => {
      await table.fetchItems();

      table.selectAll();

      expect(table.getSelectedItems().value.length).toBe(3);
    });

    it("isSelected retourne le bon état", async () => {
      await table.fetchItems();

      table.selectItem(mockItems[0]);

      expect(table.isSelected(mockItems[0])).toBe(true);
      expect(table.isSelected(mockItems[1])).toBe(false);
    });
  });

  describe("reset", () => {
    it("reset réinitialise tout l'état", async () => {
      await table.fetchItems();
      table.selectAll();
      await table.setSort("name", "desc");
      table.setSearch("test");
      table.setFilter("status", "active");

      table.reset();

      expect(table.getItems().value).toEqual([]);
      expect(table.getSelectedItems().value.length).toBe(0);
      expect(table.getSort().value).toBeNull();
      expect(table.getSearch().value).toBe("");
      expect(table.getFilters().value).toEqual({});
      expect(table.getLastUpdate().value).toBeNull();
    });
  });

  describe("getPaginatedItems", () => {
    it("retourne directement les items (server-side pagination)", async () => {
      await table.fetchItems();

      const paginated = table.getPaginatedItems();

      // ServerDataTable returns the items directly (computed ref)
      expect(paginated.value).toEqual(mockItems);
    });
  });

  describe("payload builder", () => {
    it("utilise le payload builder par défaut", async () => {
      await table.setSort("name", "asc");

      const callArg = mockFetchFunction.mock.calls[0][0];
      expect(callArg).toHaveProperty("page");
      expect(callArg).toHaveProperty("per_page");
      expect(callArg).toHaveProperty("sort_by");
      expect(callArg).toHaveProperty("sort_order");
    });

    it("utilise un payload builder personnalisé", async () => {
      const customPayload = { custom: "payload", page: 1 };
      const customBuilder = vi.fn().mockReturnValue(customPayload);

      const customTable = createTable({
        payloadBuilder: customBuilder,
      });

      await customTable.fetchItems();

      expect(customBuilder).toHaveBeenCalled();
      expect(mockFetchFunction).toHaveBeenCalledWith(customPayload);
    });

    it("inclut search et filters dans le payload", async () => {
      table.setSearch("test");
      table.setFilter("status", "active");

      await table.fetchItems();

      const callArg = mockFetchFunction.mock.calls[0][0];
      expect(callArg.search).toBe("test");
      expect(callArg.filters).toEqual({ status: "active" });
    });
  });

  describe("error handling", () => {
    it("propage les erreurs non-AbortError", async () => {
      const error = new Error("Network error");
      mockFetchFunction.mockRejectedValue(error);

      await expect(table.fetchItems()).rejects.toThrow("Network error");
    });

    it("remet isLoading à false après une erreur", async () => {
      mockFetchFunction.mockRejectedValue(new Error("Network error"));

      try {
        await table.fetchItems();
      } catch {
        // Expected error
      }

      expect(table.getIsLoading().value).toBe(false);
      expect(table.getIsRefreshing().value).toBe(false);
    });
  });
});
