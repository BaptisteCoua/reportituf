# DataTable Module

Module Nuxt réutilisable et framework-agnostic pour gérer des tableaux de données côté client, avec tri, pagination et sélection.

## Installation

```bash
pnpm add @reportit/datatable
```

Ajoutez le module dans votre configuration Nuxt :
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@reportit/datatable']
})
```

## Fonctionnalités

- Tri multi-colonnes
- Pagination
- Sélection (simple, multiple, par page)
- Calculs côté client
- Architecture modulaire (State, Sorting, Pagination, Selection)

## Utilisation

### Configuration de base
```typescript
import { useDataTable } from '@reportit/datatable'

interface Asset {
  id: number
  name: string
  type: string
}

const {
  paginatedItems,
  pagination,
  toggleSort,
  setPage
} = useDataTable<Asset>({
  headers: [
    { key: 'name', title: 'Nom', sortable: true },
    { key: 'type', title: 'Type', sortable: true }
  ],
  items: [
    { id: 1, name: 'Switch 1', type: 'network' },
    { id: 2, name: 'Router 1', type: 'network' }
  ],
  itemsPerPage: 10
})
```

### Tri
```typescript
const { sort, sortedItems, toggleSort, setSort, clearSort } = useDataTable<Asset>({
  headers,
  items
})

// Toggle tri sur une colonne
toggleSort('name')

// Définir tri explicite
setSort('name', 'desc')

// Effacer le tri
clearSort()
```

### Pagination
```typescript
const {
  pagination,
  paginatedItems,
  setPage,
  nextPage,
  previousPage,
  setItemsPerPage
} = useDataTable<Asset>({
  items,
  itemsPerPage: 25
})

// Navigation
nextPage()
previousPage()
setPage(5)
goToLastPage()

// Changer le nombre d'éléments par page
setItemsPerPage(50)
```

### Sélection
```typescript
const {
  selectedItems,
  selectedIds,
  selectedCount,
  isSelected,
  isAllSelected,
  isPageSelected,
  selectItem,
  selectAll,
  selectPage,
  clearSelection
} = useDataTable<Asset>({
  items,
  itemKey: 'id'
})

// Sélectionner un élément
selectItem(item)

// Sélectionner tous les éléments de la page
selectPage()

// Sélectionner tous les éléments
selectAll()
```

## Architecture

Le module est construit avec une architecture modulaire :

- `DataTableState` : Gestion de l'état réactif
- `DataTableSorting` : Logique de tri
- `DataTablePagination` : Logique de pagination
- `DataTableSelection` : Logique de sélection
- `BaseDataTable` : Orchestration des modules

## Options de configuration

```typescript
interface DataTableOptions<T> {
  headers?: DataTableHeader[]
  items?: T[]
  itemsPerPage?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  itemKey?: string | ((item: T) => string | number)
}
```

## Méthodes disponibles

### État
- `items` : Tous les éléments
- `headers` : En-têtes du tableau
- `sort` : État du tri actuel
- `pagination` : État de la pagination
- `selectedItems` : Éléments sélectionnés
- `sortedItems` : Éléments triés
- `paginatedItems` : Éléments de la page actuelle

### Actions
- `setItems(items)` : Définir les données
- `setHeaders(headers)` : Définir les en-têtes
- `toggleSort(key)` : Basculer le tri
- `setSort(key, order)` : Définir le tri
- `clearSort()` : Effacer le tri
- `setPage(page)` : Aller à une page
- `nextPage()` / `previousPage()` : Navigation
- `setItemsPerPage(count)` : Éléments par page
- `selectItem(item)` : Sélectionner/désélectionner
- `selectAll()` : Tout sélectionner/désélectionner
- `selectPage()` : Sélectionner la page
- `clearSelection()` : Vider la sélection
- `reset()` : Réinitialiser
