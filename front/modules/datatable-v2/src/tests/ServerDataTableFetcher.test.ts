import { describe, it, expect, beforeEach, vi } from "vitest";
import { ServerDataTableFetcher } from "../handlers/ServerDataTableFetcher";
import { ServerDataTableState } from "../state/ServerDataTableState";
import type { ServerFetchResponse } from "../types/ServerDataTable.types";

interface TestItem {
  id: number;
  name: string;
}

describe("ServerDataTableFetcher", () => {
  let fetcher: ServerDataTableFetcher<TestItem>;
  let state: ServerDataTableState<TestItem>;
  let mockFetchFunction: ReturnType<typeof vi.fn>;

  const mockItems: TestItem[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];

  const mockResponse: ServerFetchResponse<TestItem> = {
    items: mockItems,
    total: 50,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchFunction = vi.fn().mockResolvedValue(mockResponse);

    state = new ServerDataTableState<TestItem>({
      fetchFunction: mockFetchFunction,
    });

    fetcher = new ServerDataTableFetcher<TestItem>(state);
  });

  describe("fetchItems", () => {
    it("appelle la fonction de fetch avec le payload construit", async () => {
      await fetcher.fetchItems();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("met à jour les items dans le state", async () => {
      await fetcher.fetchItems();

      expect(state.getItems().value).toEqual(mockItems);
    });

    it("met à jour le total des items", async () => {
      await fetcher.fetchItems();

      expect(state.getPagination().value.totalItems).toBe(50);
    });

    it("met à jour lastUpdate avec la date actuelle", async () => {
      const before = new Date();
      await fetcher.fetchItems();
      const after = new Date();

      const lastUpdate = state.getLastUpdate().value;
      expect(lastUpdate).toBeInstanceOf(Date);
      expect(lastUpdate!.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(lastUpdate!.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("stocke les derniers paramètres de fetch", async () => {
      state.setPagination({ page: 2, itemsPerPage: 25 });
      await fetcher.fetchItems();

      const lastParams = state.getLastFetchParams().value;
      expect(lastParams).toMatchObject({
        page: 2,
        itemsPerPage: 25,
      });
    });

    it("accepte des paramètres additionnels", async () => {
      await fetcher.fetchItems({ page: 5 });

      const lastParams = state.getLastFetchParams().value;
      expect(lastParams?.page).toBe(5);
    });

    it("gère l'état isLoading", async () => {
      expect(state.getIsLoading().value).toBe(false);

      const fetchPromise = fetcher.fetchItems();
      expect(state.getIsLoading().value).toBe(true);

      await fetchPromise;
      expect(state.getIsLoading().value).toBe(false);
    });

    it("gère l'état isRefreshing", async () => {
      expect(state.getIsRefreshing().value).toBe(false);

      const fetchPromise = fetcher.fetchItems();
      expect(state.getIsRefreshing().value).toBe(true);

      await fetchPromise;
      expect(state.getIsRefreshing().value).toBe(false);
    });

    it("retourne la réponse du fetch", async () => {
      const response = await fetcher.fetchItems();

      expect(response).toEqual(mockResponse);
    });

    it("inclut les paramètres de tri dans le payload", async () => {
      state.setSort({ key: "name", order: "desc" });
      await fetcher.fetchItems();

      const callArg = mockFetchFunction.mock.calls[0][0];
      expect(callArg.sort_by).toBe("name");
      expect(callArg.sort_order).toBe("desc");
    });

    it("inclut les filtres dans le payload", async () => {
      state.setSearch("test");
      state.setFilter("status", "active");
      await fetcher.fetchItems();

      const callArg = mockFetchFunction.mock.calls[0][0];
      expect(callArg.search).toBe("test");
      expect(callArg.filters).toEqual({ status: "active" });
    });

    it("annule la requête précédente si une nouvelle est lancée", async () => {
      // Verify that abort is called on the previous controller
      const abortSpy = vi.spyOn(AbortController.prototype, 'abort');

      mockFetchFunction.mockResolvedValue(mockResponse);

      // Start first fetch
      const firstFetch = fetcher.fetchItems();

      // Start second fetch (should abort the first)
      const secondFetch = fetcher.fetchItems();

      await Promise.all([firstFetch, secondFetch]);

      // The abort method should have been called once
      expect(abortSpy).toHaveBeenCalled();

      abortSpy.mockRestore();
    });
  });

  describe("error handling", () => {
    it("propage les erreurs non-AbortError", async () => {
      const error = new Error("Network error");
      mockFetchFunction.mockRejectedValue(error);

      await expect(fetcher.fetchItems()).rejects.toThrow("Network error");
    });

    it("ignore les erreurs AbortError", async () => {
      const abortError = new Error("Aborted");
      abortError.name = "AbortError";
      mockFetchFunction.mockRejectedValue(abortError);

      await expect(fetcher.fetchItems()).resolves.toBeUndefined();
    });

    it("remet isLoading à false après une erreur", async () => {
      mockFetchFunction.mockRejectedValue(new Error("Network error"));

      try {
        await fetcher.fetchItems();
      } catch {
        // Expected error
      }

      expect(state.getIsLoading().value).toBe(false);
    });

    it("remet isRefreshing à false après une erreur", async () => {
      mockFetchFunction.mockRejectedValue(new Error("Network error"));

      try {
        await fetcher.fetchItems();
      } catch {
        // Expected error
      }

      expect(state.getIsRefreshing().value).toBe(false);
    });

    it("appelle le callback onError si fourni", async () => {
      const onError = vi.fn();
      const customState = new ServerDataTableState<TestItem>({
        fetchFunction: mockFetchFunction,
        onError,
      });
      const customFetcher = new ServerDataTableFetcher<TestItem>(customState);

      const error = new Error("Network error");
      mockFetchFunction.mockRejectedValue(error);

      try {
        await customFetcher.fetchItems();
      } catch {
        // Expected error
      }

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(error, {
        params: expect.objectContaining({
          page: 1,
          itemsPerPage: 10,
        }),
      });
    });

    it("n'appelle pas onError pour les AbortError", async () => {
      const onError = vi.fn();
      const customState = new ServerDataTableState<TestItem>({
        fetchFunction: mockFetchFunction,
        onError,
      });
      const customFetcher = new ServerDataTableFetcher<TestItem>(customState);

      const abortError = new Error("Aborted");
      abortError.name = "AbortError";
      mockFetchFunction.mockRejectedValue(abortError);

      await customFetcher.fetchItems();

      expect(onError).not.toHaveBeenCalled();
    });

    it("propage l'erreur même après appel du callback onError", async () => {
      const onError = vi.fn();
      const customState = new ServerDataTableState<TestItem>({
        fetchFunction: mockFetchFunction,
        onError,
      });
      const customFetcher = new ServerDataTableFetcher<TestItem>(customState);

      mockFetchFunction.mockRejectedValue(new Error("Network error"));

      await expect(customFetcher.fetchItems()).rejects.toThrow("Network error");
      expect(onError).toHaveBeenCalled();
    });
  });

  describe("refresh", () => {
    it("rappelle fetchItems avec les derniers paramètres", async () => {
      state.setPagination({ page: 3, itemsPerPage: 15 });
      await fetcher.fetchItems();
      mockFetchFunction.mockClear();

      await fetcher.refresh();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });

    it("appelle fetchItems sans paramètres si aucun fetch précédent", async () => {
      await fetcher.refresh();

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe("cancelFetch", () => {
    it("annule une requête en cours", async () => {
      let resolvePromise: (value: ServerFetchResponse<TestItem>) => void;
      mockFetchFunction.mockReturnValue(
        new Promise<ServerFetchResponse<TestItem>>((resolve) => {
          resolvePromise = resolve;
        })
      );

      const fetchPromise = fetcher.fetchItems();
      fetcher.cancelFetch();

      resolvePromise!(mockResponse);
      await fetchPromise;

      expect(state.getIsLoading().value).toBe(false);
    });

    it("ne fait rien s'il n'y a pas de requête en cours", () => {
      expect(() => fetcher.cancelFetch()).not.toThrow();
    });
  });

  describe("payload builder", () => {
    it("utilise le payload builder personnalisé du state", async () => {
      const customPayload = { custom: "value" };
      const customBuilder = vi.fn().mockReturnValue(customPayload);

      const customState = new ServerDataTableState<TestItem>({
        fetchFunction: mockFetchFunction,
        payloadBuilder: customBuilder,
      });
      const customFetcher = new ServerDataTableFetcher<TestItem>(customState);

      await customFetcher.fetchItems();

      expect(customBuilder).toHaveBeenCalled();
      expect(mockFetchFunction).toHaveBeenCalledWith(customPayload);
    });
  });
});
