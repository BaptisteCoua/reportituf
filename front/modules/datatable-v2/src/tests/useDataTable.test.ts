import { describe, it, expect, beforeEach } from "vitest";
import { useDataTable } from "../composables/useDataTable";
import type { DataTableHeader } from "../types/DataTable.types";

interface TestItem {
  id: number;
  name: string;
  age: number;
}

describe("useDataTable", () => {
  const headers: DataTableHeader[] = [
    { key: "name", title: "Nom", sortable: true },
    { key: "age", title: "Age", sortable: true },
  ];

  const items: TestItem[] = [
    { id: 1, name: "Alice", age: 30 },
    { id: 2, name: "Bob", age: 25 },
    { id: 3, name: "Charlie", age: 35 },
    { id: 4, name: "David", age: 28 },
    { id: 5, name: "Eve", age: 32 },
  ];

  describe("initialization", () => {
    it("retourne tous les refs et méthodes attendus", () => {
      const table = useDataTable<TestItem>();

      // State refs
      expect(table.items).toBeDefined();
      expect(table.headers).toBeDefined();
      expect(table.sort).toBeDefined();
      expect(table.pagination).toBeDefined();
      expect(table.selectedItems).toBeDefined();
      expect(table.isLoading).toBeDefined();
      expect(table.sortedItems).toBeDefined();
      expect(table.paginatedItems).toBeDefined();
      expect(table.isAllSelected).toBeDefined();
      expect(table.isPageSelected).toBeDefined();
      expect(table.isIndeterminate).toBeDefined();
      expect(table.isPageIndeterminate).toBeDefined();
      expect(table.selectedCount).toBeDefined();
      expect(table.selectedIds).toBeDefined();

      // Methods
      expect(typeof table.setItems).toBe("function");
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
      expect(typeof table.setLoading).toBe("function");
      expect(typeof table.reset).toBe("function");
    });

    it("initialise avec les options fournies", () => {
      const table = useDataTable<TestItem>({
        items,
        headers,
        itemsPerPage: 2,
      });

      expect(table.items.value).toEqual(items);
      expect(table.headers.value).toEqual(headers);
      expect(table.pagination.value.itemsPerPage).toBe(2);
    });

    it("initialise avec des valeurs par défaut", () => {
      const table = useDataTable<TestItem>();

      expect(table.items.value).toEqual([]);
      expect(table.headers.value).toEqual([]);
      expect(table.pagination.value.itemsPerPage).toBe(10);
    });
  });

  describe("reactive state", () => {
    it("items est réactif via setItems", () => {
      const table = useDataTable<TestItem>();

      expect(table.items.value).toEqual([]);

      table.setItems(items);

      expect(table.items.value).toEqual(items);
    });

    it("sort est réactif via toggleSort", () => {
      const table = useDataTable<TestItem>({ items });

      expect(table.sort.value).toBeNull();

      table.toggleSort("name");

      expect(table.sort.value).toEqual({ key: "name", order: "asc" });
    });

    it("pagination est réactive via setPage", () => {
      const table = useDataTable<TestItem>({
        items,
        itemsPerPage: 2,
      });

      expect(table.pagination.value.page).toBe(1);

      table.setPage(2);

      expect(table.pagination.value.page).toBe(2);
    });

    it("selectedItems est réactif via selectItem", () => {
      const table = useDataTable<TestItem>({ items });

      expect(table.selectedItems.value).toEqual([]);

      table.selectItem(items[0]);

      expect(table.selectedItems.value).toContainEqual(items[0]);
    });

    it("isLoading est réactif via setLoading", () => {
      const table = useDataTable<TestItem>();

      expect(table.isLoading.value).toBe(false);

      table.setLoading(true);

      expect(table.isLoading.value).toBe(true);
    });
  });

  describe("computed values", () => {
    it("sortedItems reflète le tri", () => {
      const table = useDataTable<TestItem>({ items });

      table.setSort("age", "asc");

      expect(table.sortedItems.value[0].age).toBe(25);
      expect(table.sortedItems.value[4].age).toBe(35);
    });

    it("paginatedItems reflète la pagination", () => {
      const table = useDataTable<TestItem>({
        items,
        itemsPerPage: 2,
      });

      expect(table.paginatedItems.value.length).toBe(2);
      expect(table.paginatedItems.value[0].id).toBe(1);

      table.setPage(2);

      expect(table.paginatedItems.value[0].id).toBe(3);
    });

    it("isAllSelected reflète la sélection", () => {
      const table = useDataTable<TestItem>({ items });

      expect(table.isAllSelected.value).toBe(false);

      table.selectAll();

      expect(table.isAllSelected.value).toBe(true);
    });

    it("isPageSelected reflète la sélection de la page", () => {
      const table = useDataTable<TestItem>({
        items,
        itemsPerPage: 2,
      });

      expect(table.isPageSelected.value).toBe(false);

      table.selectPage();

      expect(table.isPageSelected.value).toBe(true);
    });

    it("isIndeterminate reflète la sélection partielle", () => {
      const table = useDataTable<TestItem>({ items });

      expect(table.isIndeterminate.value).toBe(false);

      table.selectItem(items[0]);

      expect(table.isIndeterminate.value).toBe(true);
    });

    it("selectedCount reflète le nombre de sélections", () => {
      const table = useDataTable<TestItem>({ items });

      expect(table.selectedCount.value).toBe(0);

      table.selectItems([items[0], items[1]]);

      expect(table.selectedCount.value).toBe(2);
    });

    it("selectedIds reflète les IDs sélectionnés", () => {
      const table = useDataTable<TestItem>({ items });

      table.selectItems([items[0], items[2]]);

      expect(table.selectedIds.value).toContain(1);
      expect(table.selectedIds.value).toContain(3);
    });
  });

  describe("methods are properly bound", () => {
    it("les méthodes fonctionnent quand destructurées", () => {
      const { setItems, items, selectItem, getSelectedItems } =
        useDataTable<TestItem>();

      setItems([{ id: 1, name: "Test", age: 25 }]);
      expect(items.value.length).toBe(1);

      selectItem({ id: 1, name: "Test", age: 25 });
      // Le binding devrait fonctionner
    });

    it("toggleSort fonctionne après destructuration", () => {
      const { toggleSort, sort, setItems } = useDataTable<TestItem>({ items });

      toggleSort("name");

      expect(sort.value).toEqual({ key: "name", order: "asc" });
    });

    it("pagination fonctionne après destructuration", () => {
      const { nextPage, previousPage, pagination, setItems } =
        useDataTable<TestItem>({
          items,
          itemsPerPage: 2,
        });

      nextPage();
      expect(pagination.value.page).toBe(2);

      previousPage();
      expect(pagination.value.page).toBe(1);
    });
  });

  describe("reset", () => {
    it("reset réinitialise tout l'état", () => {
      const table = useDataTable<TestItem>({ items });

      table.selectAll();
      table.setSort("name", "desc");
      table.setPage(2);
      table.setLoading(true);

      table.reset();

      expect(table.items.value).toEqual([]);
      expect(table.selectedItems.value).toEqual([]);
      expect(table.sort.value).toBeNull();
      expect(table.pagination.value.page).toBe(1);
      expect(table.isLoading.value).toBe(false);
    });
  });
});
