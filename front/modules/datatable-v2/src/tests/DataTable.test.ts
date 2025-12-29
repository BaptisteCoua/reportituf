import { describe, it, expect, beforeEach } from "vitest";
import { DataTable } from "../DataTable";
import type { DataTableHeader } from "../types/DataTable.types";

interface TestItem {
  id: number;
  name: string;
  email: string;
  age: number;
}

describe("DataTable", () => {
  let table: DataTable<TestItem>;
  const headers: DataTableHeader[] = [
    { key: "name", title: "Nom", sortable: true },
    { key: "email", title: "Email", sortable: true },
    { key: "age", title: "Age", sortable: true },
  ];

  const items: TestItem[] = [
    { id: 1, name: "Alice", email: "alice@test.com", age: 30 },
    { id: 2, name: "Bob", email: "bob@test.com", age: 25 },
    { id: 3, name: "Charlie", email: "charlie@test.com", age: 35 },
    { id: 4, name: "David", email: "david@test.com", age: 28 },
    { id: 5, name: "Eve", email: "eve@test.com", age: 32 },
  ];

  beforeEach(() => {
    table = new DataTable<TestItem>({
      headers,
      items,
      itemsPerPage: 2,
    });
  });

  describe("initialization", () => {
    it("initialise avec les options fournies", () => {
      expect(table.getItems().value).toEqual(items);
      expect(table.getHeaders().value).toEqual(headers);
      expect(table.getPagination().value.itemsPerPage).toBe(2);
    });

    it("initialise avec des valeurs par défaut si aucune option", () => {
      const emptyTable = new DataTable<TestItem>();
      expect(emptyTable.getItems().value).toEqual([]);
      expect(emptyTable.getHeaders().value).toEqual([]);
      expect(emptyTable.getPagination().value.itemsPerPage).toBe(10);
    });

    it("initialise avec un tri par défaut si spécifié", () => {
      const sortedTable = new DataTable<TestItem>({
        items,
        sortBy: "name",
        sortOrder: "desc",
      });
      expect(sortedTable.getSort().value).toEqual({ key: "name", order: "desc" });
    });
  });

  describe("setItems / setHeaders", () => {
    it("met à jour les items", () => {
      const newItems = [{ id: 10, name: "New", email: "new@test.com", age: 40 }];
      table.setItems(newItems);
      expect(table.getItems().value).toEqual(newItems);
    });

    it("met à jour les headers", () => {
      const newHeaders: DataTableHeader[] = [{ key: "id", title: "ID" }];
      table.setHeaders(newHeaders);
      expect(table.getHeaders().value).toEqual(newHeaders);
    });

    it("met à jour totalItems lors de setItems", () => {
      table.setItems([items[0], items[1]]);
      expect(table.getPagination().value.totalItems).toBe(2);
    });
  });

  describe("sorting", () => {
    it("toggleSort active le tri ascendant", () => {
      table.toggleSort("name");
      expect(table.getSort().value).toEqual({ key: "name", order: "asc" });
    });

    it("toggleSort bascule en descendant si déjà ascendant", () => {
      table.toggleSort("name");
      table.toggleSort("name");
      expect(table.getSort().value).toEqual({ key: "name", order: "desc" });
    });

    it("toggleSort efface le tri si déjà descendant", () => {
      table.toggleSort("name");
      table.toggleSort("name");
      table.toggleSort("name");
      expect(table.getSort().value).toBeNull();
    });

    it("toggleSort sur une nouvelle colonne réinitialise en ascendant", () => {
      table.toggleSort("name");
      table.toggleSort("name");
      table.toggleSort("age");
      expect(table.getSort().value).toEqual({ key: "age", order: "asc" });
    });

    it("setSort définit le tri directement", () => {
      table.setSort("email", "desc");
      expect(table.getSort().value).toEqual({ key: "email", order: "desc" });
    });

    it("clearSort efface le tri", () => {
      table.setSort("name", "asc");
      table.clearSort();
      expect(table.getSort().value).toBeNull();
    });

    it("getSortedItems retourne les items triés", () => {
      table.setSort("age", "asc");
      const sorted = table.getSortedItems().value;
      expect(sorted[0].age).toBe(25);
      expect(sorted[4].age).toBe(35);
    });

    it("getSortedItems tri descendant", () => {
      table.setSort("age", "desc");
      const sorted = table.getSortedItems().value;
      expect(sorted[0].age).toBe(35);
      expect(sorted[4].age).toBe(25);
    });

    it("getSortedItems sans tri retourne les items originaux", () => {
      const sorted = table.getSortedItems().value;
      expect(sorted).toEqual(items);
    });
  });

  describe("pagination", () => {
    it("getPaginatedItems retourne la première page", () => {
      const paginated = table.getPaginatedItems().value;
      expect(paginated.length).toBe(2);
      expect(paginated[0].id).toBe(1);
      expect(paginated[1].id).toBe(2);
    });

    it("setPage change la page courante", () => {
      table.setPage(2);
      expect(table.getPagination().value.page).toBe(2);
      const paginated = table.getPaginatedItems().value;
      expect(paginated[0].id).toBe(3);
    });

    it("setPage ne dépasse pas les limites", () => {
      table.setPage(100);
      expect(table.getPagination().value.page).toBe(3); // 5 items / 2 per page = 3 pages
    });

    it("setPage ne va pas en dessous de 1", () => {
      table.setPage(-5);
      expect(table.getPagination().value.page).toBe(1);
    });

    it("nextPage avance d'une page", () => {
      table.nextPage();
      expect(table.getPagination().value.page).toBe(2);
    });

    it("nextPage ne dépasse pas la dernière page", () => {
      table.setPage(3);
      table.nextPage();
      expect(table.getPagination().value.page).toBe(3);
    });

    it("previousPage recule d'une page", () => {
      table.setPage(2);
      table.previousPage();
      expect(table.getPagination().value.page).toBe(1);
    });

    it("previousPage ne va pas en dessous de 1", () => {
      table.previousPage();
      expect(table.getPagination().value.page).toBe(1);
    });

    it("goToFirstPage va à la première page", () => {
      table.setPage(3);
      table.goToFirstPage();
      expect(table.getPagination().value.page).toBe(1);
    });

    it("goToLastPage va à la dernière page", () => {
      table.goToLastPage();
      expect(table.getPagination().value.page).toBe(3);
    });

    it("setItemsPerPage change le nombre d'items par page", () => {
      table.setItemsPerPage(5);
      expect(table.getPagination().value.itemsPerPage).toBe(5);
      expect(table.getPagination().value.page).toBe(1);
    });

    it("calcule correctement totalPages", () => {
      expect(table.getPagination().value.totalPages).toBe(3);
      table.setItemsPerPage(5);
      expect(table.getPagination().value.totalPages).toBe(1);
    });
  });

  describe("selection", () => {
    it("selectItem ajoute un item à la sélection", () => {
      table.selectItem(items[0]);
      expect(table.getSelectedItems().value).toContainEqual(items[0]);
    });

    it("selectItem retire un item déjà sélectionné", () => {
      table.selectItem(items[0]);
      table.selectItem(items[0]);
      expect(table.getSelectedItems().value).not.toContainEqual(items[0]);
    });

    it("selectItems ajoute plusieurs items", () => {
      table.selectItems([items[0], items[1]]);
      expect(table.getSelectedItems().value.length).toBe(2);
    });

    it("selectItems n'ajoute pas de doublons", () => {
      table.selectItem(items[0]);
      table.selectItems([items[0], items[1]]);
      expect(table.getSelectedItems().value.length).toBe(2);
    });

    it("deselectItems retire les items spécifiés", () => {
      table.selectItems([items[0], items[1], items[2]]);
      table.deselectItems([items[0], items[2]]);
      expect(table.getSelectedItems().value.length).toBe(1);
      expect(table.getSelectedItems().value[0]).toEqual(items[1]);
    });

    it("selectAll sélectionne tous les items", () => {
      table.selectAll();
      expect(table.getSelectedItems().value.length).toBe(5);
    });

    it("selectAll désélectionne si tout est déjà sélectionné", () => {
      table.selectAll();
      table.selectAll();
      expect(table.getSelectedItems().value.length).toBe(0);
    });

    it("selectPage sélectionne les items de la page courante", () => {
      table.selectPage();
      expect(table.getSelectedItems().value.length).toBe(2);
      expect(table.getSelectedItems().value).toContainEqual(items[0]);
      expect(table.getSelectedItems().value).toContainEqual(items[1]);
    });

    it("selectPage désélectionne si la page est déjà sélectionnée", () => {
      table.selectPage();
      table.selectPage();
      expect(table.getSelectedItems().value.length).toBe(0);
    });

    it("clearSelection vide la sélection", () => {
      table.selectAll();
      table.clearSelection();
      expect(table.getSelectedItems().value.length).toBe(0);
    });

    it("isSelected retourne true si l'item est sélectionné", () => {
      table.selectItem(items[0]);
      expect(table.isSelected(items[0])).toBe(true);
      expect(table.isSelected(items[1])).toBe(false);
    });

    it("isAllSelected retourne true si tous les items sont sélectionnés", () => {
      expect(table.isAllSelected().value).toBe(false);
      table.selectAll();
      expect(table.isAllSelected().value).toBe(true);
    });

    it("isPageSelected retourne true si la page est sélectionnée", () => {
      expect(table.isPageSelected().value).toBe(false);
      table.selectPage();
      expect(table.isPageSelected().value).toBe(true);
    });

    it("isIndeterminate retourne true si sélection partielle", () => {
      expect(table.isIndeterminate().value).toBe(false);
      table.selectItem(items[0]);
      expect(table.isIndeterminate().value).toBe(true);
      table.selectAll();
      expect(table.isIndeterminate().value).toBe(false);
    });

    it("isPageIndeterminate retourne true si sélection partielle sur la page", () => {
      expect(table.isPageIndeterminate().value).toBe(false);
      table.selectItem(items[0]);
      expect(table.isPageIndeterminate().value).toBe(true);
    });

    it("getSelectedCount retourne le nombre d'items sélectionnés", () => {
      expect(table.getSelectedCount().value).toBe(0);
      table.selectItems([items[0], items[1]]);
      expect(table.getSelectedCount().value).toBe(2);
    });

    it("getSelectedIds retourne les IDs des items sélectionnés", () => {
      table.selectItems([items[0], items[2]]);
      const ids = table.getSelectedIds().value;
      expect(ids).toContain(1);
      expect(ids).toContain(3);
      expect(ids.length).toBe(2);
    });
  });

  describe("loading state", () => {
    it("setLoading change l'état de chargement", () => {
      expect(table.getIsLoading().value).toBe(false);
      table.setLoading(true);
      expect(table.getIsLoading().value).toBe(true);
      table.setLoading(false);
      expect(table.getIsLoading().value).toBe(false);
    });
  });

  describe("reset", () => {
    it("reset réinitialise tout l'état", () => {
      table.selectAll();
      table.setSort("name", "desc");
      table.setPage(2);
      table.setLoading(true);

      table.reset();

      expect(table.getItems().value).toEqual([]);
      expect(table.getSelectedItems().value.length).toBe(0);
      expect(table.getSort().value).toBeNull();
      expect(table.getPagination().value.page).toBe(1);
      expect(table.getIsLoading().value).toBe(false);
    });
  });

  describe("custom itemKey", () => {
    it("fonctionne avec une clé personnalisée", () => {
      const customTable = new DataTable<TestItem>({
        items,
        itemKey: "email",
      });
      customTable.selectItem(items[0]);
      expect(customTable.getSelectedIds().value).toContain("alice@test.com");
    });

    it("fonctionne avec une fonction itemKey", () => {
      const customTable = new DataTable<TestItem>({
        items,
        itemKey: (item) => `user-${item.id}`,
      });
      customTable.selectItem(items[0]);
      expect(customTable.getSelectedIds().value).toContain("user-1");
    });
  });
});
