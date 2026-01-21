# DataTable Define Module

Module pour industrialiser la gestion des tableaux avec état partagé, réactivité et persistance.

## Installation

```bash
pnpm add @reportituf/datatable-define
```

## Fonctionnalités

- **Store dynamique** : Chaque table crée automatiquement un store réactif partagé
- **Body réactif** : Source de vérité unique pour page, sorts, search, filters
- **Persistance** : Sauvegarde automatique dans sessionStorage ou localStorage
- **Sélection** : Gestion complète de la sélection (items, page, all)
- **Fetch flexible** : Connectez votre SDK, votre API ou vos données
- **Watchers auto** : Refetch automatique quand le body change
- **Production-ready** : AbortController, cleanup, debounce, race condition handling

## Utilisation de base

### Client-side (données statiques)

```typescript
import { defineDataTable } from '@reportituf/datatable-define'

interface User {
  id: number
  name: string
  email: string
}

export const useUserTable = defineDataTable<User>('users', {
  headers: [
    { key: 'name', title: 'Nom', sortable: true },
    { key: 'email', title: 'Email', sortable: true }
  ],
  itemsPerPage: 10
})

const table = useUserTable()
table.items.value = myUsersArray
```

### Server-side (avec fetch)

```typescript
import { defineDataTable } from '@reportituf/datatable-define'

interface Asset {
  id: number
  name: string
  type: string
}

export const useAssetTable = defineDataTable<Asset>('assets', {
  headers: [
    { key: 'name', title: 'Nom', sortable: true },
    { key: 'type', title: 'Type', sortable: true }
  ],
  itemsPerPage: 20,
  persist: 'session'
})

const table = useAssetTable()

const { refresh } = table.useFetch(async (body) => {
  const response = await Asset.search({
    page: body.page,
    limit: body.itemsPerPage,
    sorts: body.sorts,
    search: body.search,
    filters: body.filters
  })

  return {
    items: response.data,
    total: response.meta.total
  }
})

await refresh()
```

## Body réactif

Le `body` est la source de vérité pour tous les paramètres du tableau :

```typescript
const table = useAssetTable()

table.body.value.page = 2
table.body.value.sorts = [{ key: 'name', order: 'asc' }]
table.body.value.search = 'cisco'
table.body.value.filters = { status: 'active', type: 'switch' }
```

Chaque modification du body déclenche automatiquement un refetch (si `useFetch` est configuré avec `watch: true`).

## Actions

### Pagination

```typescript
table.setPage(3)
table.body.value.itemsPerPage = 50
```

### Tri

```typescript
table.setSorts([
  { key: 'name', order: 'asc' },
  { key: 'created_at', order: 'desc' }
])

table.clearSorts()
```

### Recherche

```typescript
table.setSearch('cisco')
table.clearSearch()
```

### Filtres

```typescript
table.setFilters({ status: 'active', type: 'switch' })
table.clearFilters()
```

### Sélection

```typescript
table.selectItems([item1, item2])
table.deselectItems([item1])
table.toggleSelectAll()
table.toggleSelectPage()
table.clearSelection()

if (table.isSelected(item)) {
  // ...
}
```

## Store partagé

Le même ID = le même store partagé entre composants :

```typescript
// Composant ListePage.vue
const table = useAssetTable()
table.body.value.filters = { status: 'active' }

// Composant Sidebar.vue (même slug = même store)
const table = useAssetTable()
console.log(table.filters.value)
```

## Persistance

```typescript
defineDataTable('assets', {
  persist: 'session'
})

defineDataTable('users', {
  persist: 'local'
})
```

Restaure automatiquement le body au retour sur la page.

## useFetch avec watchers

### Mode auto (défaut)

```typescript
const { refresh } = table.useFetch(fetchFn)

await refresh()
```

Watchers actifs :
- `page`, `sorts` → refetch immédiat
- `search`, `filters` → refetch avec debounce 300ms

### Mode manuel

```typescript
const { refresh } = table.useFetch(fetchFn, { watch: false })

await refresh()

watch(() => table.body.value.search, () => refresh())
```

## Éviter le double fetch

```typescript
const table = defineDataTable('assets', {
  initialBody: {
    filters: { status: 'active' },
    search: 'cisco'
  }
})

const { refresh } = table.useFetch(fetchFn)
await refresh()
```

Le body est déjà complet au premier fetch, pas de refetch parasite.

## Reset

```typescript
table.reset()
```

Remet à zéro items, selection, totalItems et restaure le body initial.

## Registry

```typescript
import { hasDataTable, clearDataTableRegistry } from '@reportituf/datatable-define'

if (hasDataTable('assets')) {
  // ...
}

clearDataTableRegistry()
```

## Exports

```typescript
export { defineDataTable } from './defineDataTable'
export { clearDataTableRegistry, hasDataTable } from './store/registry'

export type {
  DataTableSort,
  DataTablePagination,
  DataTableHeader,
  DataTableBody,
  DataTableOptions,
  DataTableReturn,
  FetchResponse,
  FetchFunction,
  UseFetchOptions
}
```

## Types

```typescript
interface DataTableBody {
  page: number
  itemsPerPage: number
  sorts: DataTableSort[]
  search: string
  filters: Record<string, unknown>
}

interface DataTableOptions<T> {
  headers?: DataTableHeader[]
  itemsPerPage?: number
  itemKey?: string | ((item: T) => string | number)
  initialBody?: Partial<DataTableBody>
  persist?: boolean | 'session' | 'local'
}

type FetchFunction<T> = (body: DataTableBody) => Promise<FetchResponse<T>>

interface FetchResponse<T> {
  items: T[]
  total: number
}
```

## Intégration avec autres modules

Ce module s'intègre avec :
- **SDK** : Connectez votre fetchFn avec le SDK
- **Forms/Filters** : Bindez vos filtres avec `table.body.value.filters`
- **Query builders** : Transformez le body dans votre fetchFn selon votre format API

```typescript
const filtersStore = useAssetFilters()

watch(filtersStore, (newFilters) => {
  table.body.value.filters = newFilters
}, { deep: true })
```
