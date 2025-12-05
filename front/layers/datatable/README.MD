# DataTable

Deux composables réutilisables et framework-agnostic pour gérer des tableaux de données : côté client et côté serveur, avec tri, pagination, filtres et sélection.

## Installation

Ajoutez le layer dans votre configuration Nuxt :
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['./layers/datatable']
})
```

## Fonctionnalités

### DataTable (client-side)
- Tri multi-colonnes
- Pagination
- Sélection (simple, multiple, par page)
- Calculs côté client

### ServerDataTable (server-side)
- Tri avec appels API
- Pagination serveur
- Recherche avec debounce
- Filtres dynamiques
- Construction de payload personnalisable
- Gestion des appels API (abort, refresh)

## DataTable - Utilisation côté client

### Configuration de base
```typescript
import { useDataTable } from '~/layers/datatable/composables'

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
const { 
  sort,
  sortedItems,
  toggleSort,
  setSort,
  clearSort
} = useDataTable<Asset>({
  headers,
  items
})

// Toggle tri sur une colonne
toggleSort('name')

// Définir tri explicite
setSort('name', 'desc')

// Effacer le tri
clearSort()

// État du tri
console.log(sort.value) // { key: 'name', order: 'asc' }
```

### Pagination
```typescript
const { 
  pagination,
  paginatedItems,
  setPage,
  nextPage,
  previousPage,
  goToFirstPage,
  goToLastPage,
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

// État de la pagination
console.log(pagination.value)
// {
//   page: 1,
//   itemsPerPage: 25,
//   totalItems: 150,
//   totalPages: 6
// }
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
  isIndeterminate,
  selectItem,
  selectItems,
  selectAll,
  selectPage,
  clearSelection
} = useDataTable<Asset>({
  items,
  itemKey: 'id'
})

// Sélectionner un élément
selectItem(item)

// Sélectionner plusieurs éléments
selectItems([item1, item2])

// Sélectionner tous les éléments de la page
selectPage()

// Sélectionner tous les éléments
selectAll()

// Vérifier si un élément est sélectionné
if (isSelected(item)) {
  console.log('Élément sélectionné')
}

// Obtenir les IDs sélectionnés
console.log(selectedIds.value) // [1, 3, 5]
```

## ServerDataTable - Utilisation côté serveur

### Configuration de base
```typescript
import { useServerDataTable, lomkitPayloadBuilder } from '~/layers/datatable/composables'

const { 
  items,
  pagination,
  isLoading,
  setSearch,
  setFilter,
  toggleSort
} = useServerDataTable<Asset>({
  headers: [
    { key: 'name', title: 'Nom', sortable: true },
    { key: 'type', title: 'Type', sortable: true }
  ],
  fetchFunction: async (payload) => {
    const response = await $fetch('/api/assets', {
      method: 'POST',
      body: payload
    })
    return {
      items: response.data,
      total: response.meta.total
    }
  },
  payloadBuilder: lomkitPayloadBuilder,
  autoFetch: true,
  debounceMs: 300
})
```

## Le layer ne gère QUE le payload

Le layer DataTable est complètement agnostic de la communication avec le serveur. Il construit uniquement le payload, c'est votre SDK qui gère les appels HTTP/GraphQL/etc.

### Principe

1. Le composable construit un  payload  selon le format choisi (Lomkit, GraphQL, custom)
2. Votre fetchFunction reçoit ce payload
3. Votre SDK gère l'appel (POST, GET, GraphQL, WebSocket, etc.)
4. Vous retournez `{ items, total }` normalisé

### Avec SDK RestApiLomkit
```typescript
import { useServerDataTable, lomkitPayloadBuilder } from '~/layers/datatable/composables'
import { Asset } from '~/sdk'

const { items, setSearch } = useServerDataTable<Asset>({
  headers: [
    { key: 'name', title: 'Nom', sortable: true },
  ],
  fetchFunction: async (payload) => {
    const response = await Asset.search(payload)
    return {
      items: response.data,
      total: response.meta.total
    }
  },
  payloadBuilder: lomkitPayloadBuilder
})
```

Payload généré par `lomkitPayloadBuilder` :
```json
{
  "pagination": { "page": 1, "limit": 10 },
  "sorts": [{ "field": "name", "direction": "asc" }],
  "search": { "query": "cisco" },
  "filters": [{ "field": "type", "operator": "=", "value": "switch" }]
}
```

### Avec SDK GraphQL
```typescript
import { useServerDataTable, graphqlPayloadBuilder } from '~/layers/datatable/composables'
import { apolloClient } from '~/graphql/client'
import { GET_ASSETS } from '~/graphql/queries'

const { items } = useServerDataTable({
  fetchFunction: async (payload) => {
    const { data } = await apolloClient.query({
      query: GET_ASSETS,
      variables: payload
    })
    return {
      items: data.assets.data,
      total: data.assets.total
    }
  },
  payloadBuilder: graphqlPayloadBuilder
})
```

Payload généré par `graphqlPayloadBuilder` :
```json
{
  "pagination": { "page": 1, "limit": 10 },
  "sort": { "field": "name", "order": "ASC" },
  "search": "cisco",
  "filters": { "type": "switch" }
}
```

### Avec SDK custom
```typescript
import { useServerDataTable, createCustomPayloadBuilder } from '~/layers/datatable/composables'
import { MySDK } from '~/sdk'

const myPayloadBuilder = createCustomPayloadBuilder((params) => {
  return {
    pageNumber: params.page,
    pageSize: params.itemsPerPage,
    orderBy: params.sortBy,
    orderDirection: params.sortOrder,
    searchQuery: params.search,
    filters: params.filters
  }
})

const { items } = useServerDataTable({
  fetchFunction: async (payload) => {
    const response = await MySDK.fetchData(payload)
    return {
      items: response.results,
      total: response.count
    }
  },
  payloadBuilder: myPayloadBuilder
})
```

### Payload Builders fournis

Le layer fournit 3 builders prêts à l'emploi :

#### lomkitPayloadBuilder

Format structuré pour APIs utilisant Lomkit.

#### graphqlPayloadBuilder

Format variables GraphQL standard.

#### defaultPayloadBuilder

Format simple et générique :
```json
{
  "page": 1,
  "per_page": 10,
  "sort_by": "name",
  "sort_order": "asc",
  "search": "cisco",
  "filters": { "type": "switch" }
}
```

### Créer votre propre builder
```typescript
import { createCustomPayloadBuilder } from '~/layers/datatable/composables'

const myBuilder = createCustomPayloadBuilder((params) => {
  return {
    // ... votre format
  }
})
```

### Recherche et filtres
```typescript
const { 
  search,
  filters,
  setSearch,
  setFilter,
  setFilters,
  clearFilters,
  clearSearch
} = useServerDataTable({
  fetchFunction,
  payloadBuilder: lomkitPayloadBuilder,
  debounceMs: 500
})

// Recherche avec debounce
setSearch('cisco')

// Recherche immédiate
setSearch('cisco', true)

// Définir un filtre
setFilter('type', 'switch')

// Définir plusieurs filtres
setFilters({
  type: 'switch',
  status: 'active',
  datacenter_id: 5
})

// Effacer les filtres
clearFilters()
clearSearch()
```

### Gestion des appels
```typescript
const { 
  isLoading,
  isRefreshing,
  fetchItems,
  refresh,
  cancelFetch
} = useServerDataTable({
  fetchFunction,
  autoFetch: false
})

// Charger manuellement
await fetchItems()

// Rafraîchir avec les mêmes paramètres
await refresh()

// Annuler l'appel en cours
cancelFetch()
```

### Réutilisation du payload

Le payload builder est réutilisable partout dans votre app :
```typescript
import { lomkitPayloadBuilder } from '~/layers/datatable/composables'
import { Asset } from '~/sdk'

export async function exportAssets(filters = {}) {
  const payload = lomkitPayloadBuilder({
    page: 1,
    itemsPerPage: 10000,
    filters
  })
  
  return await Asset.export(payload)
}

export async function getAssetsStats(dateRange) {
  const payload = lomkitPayloadBuilder({
    page: 1,
    itemsPerPage: 1,
    filters: { created_at: dateRange }
  })
  
  return await Asset.stats(payload)
}
```

## Options de configuration

### DataTable
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

### ServerDataTable
```typescript
interface ServerDataTableOptions<T> {
  headers?: DataTableHeader[]
  fetchFunction: (payload: unknown) => Promise<ServerFetchResponse<T>>
  payloadBuilder?: PayloadBuilderFunction
  autoFetch?: boolean
  debounceMs?: number
  itemsPerPage?: number
  itemKey?: string | ((item: T) => string | number)
}
```

## Méthodes disponibles

### DataTable - État
- `items` : Tous les éléments
- `headers` : En-têtes du tableau
- `sort` : État du tri actuel
- `pagination` : État de la pagination
- `selectedItems` : Éléments sélectionnés
- `sortedItems` : Éléments triés
- `paginatedItems` : Éléments de la page actuelle
- `isLoading` : Indicateur de chargement
- `selectedCount` : Nombre d'éléments sélectionnés
- `selectedIds` : IDs des éléments sélectionnés
- `isAllSelected` : Tous sélectionnés
- `isPageSelected` : Page actuelle sélectionnée
- `isIndeterminate` : Sélection partielle

### DataTable - Actions
- `setItems(items)` : Définir les données
- `setHeaders(headers)` : Définir les en-têtes
- `toggleSort(key)` : Basculer le tri
- `setSort(key, order)` : Définir le tri
- `clearSort()` : Effacer le tri
- `setPage(page)` : Aller à une page
- `nextPage()` : Page suivante
- `previousPage()` : Page précédente
- `goToFirstPage()` : Première page
- `goToLastPage()` : Dernière page
- `setItemsPerPage(count)` : Éléments par page
- `selectItem(item)` : Sélectionner/désélectionner
- `selectItems(items)` : Sélectionner plusieurs
- `deselectItems(items)` : Désélectionner plusieurs
- `selectAll()` : Tout sélectionner/désélectionner
- `selectPage()` : Sélectionner la page
- `clearSelection()` : Vider la sélection
- `isSelected(item)` : Vérifier la sélection
- `reset()` : Réinitialiser

### ServerDataTable - État
- `items` : Éléments de la page
- `headers` : En-têtes
- `sort` : Tri actuel
- `pagination` : Pagination
- `search` : Recherche actuelle
- `filters` : Filtres actifs
- `isLoading` : Chargement initial
- `isRefreshing` : Rafraîchissement
- `selectedItems` : Sélection
- (Mêmes états de sélection que DataTable)

### ServerDataTable - Actions
- `setHeaders(headers)` : Définir les en-têtes
- `toggleSort(key)` : Tri (avec fetch)
- `setSort(key, order)` : Définir tri (avec fetch)
- `clearSort()` : Effacer tri (avec fetch)
- `setPage(page)` : Changer page (avec fetch)
- `nextPage()` : Page suivante (avec fetch)
- `previousPage()` : Page précédente (avec fetch)
- `setItemsPerPage(count)` : Éléments/page (avec fetch)
- `setSearch(query, immediate?)` : Rechercher
- `setFilter(key, value)` : Ajouter filtre (avec fetch)
- `setFilters(filters)` : Définir filtres (avec fetch)
- `clearFilters()` : Effacer filtres (avec fetch)
- `clearSearch()` : Effacer recherche (avec fetch)
- `fetchItems()` : Charger manuellement
- `refresh()` : Rafraîchir
- `cancelFetch()` : Annuler l'appel
- (Mêmes actions de sélection que DataTable)

## Exemples d'intégration

### Avec Vuetify
```vue
<template>
  <v-data-table
    :items="paginatedItems"
    :headers="headers"
    :loading="isLoading"
    show-select
    :model-value="selectedItems"
  >
    <template #header.data-table-select>
      <v-checkbox
        :model-value="isPageSelected"
        :indeterminate="isPageIndeterminate"
        @update:model-value="selectPage"
      />
    </template>
    
    <template #item.data-table-select="{ item }">
      <v-checkbox
        :model-value="isSelected(item)"
        @update:model-value="selectItem(item)"
      />
    </template>
  </v-data-table>
  
  <v-pagination
    :model-value="pagination.page"
    :length="pagination.totalPages"
    @update:model-value="setPage"
  />
</template>
```

### Actions groupées
```vue
<script setup>
const { selectedIds, clearSelection, refresh } = useServerDataTable({
  fetchFunction,
  payloadBuilder: lomkitPayloadBuilder
})

const deleteSelected = async () => {
  await $fetch('/api/assets/bulk-delete', {
    method: 'DELETE',
    body: { ids: selectedIds.value }
  })
  clearSelection()
  await refresh()
}
</script>

<template>
  <v-toolbar v-if="selectedCount > 0">
    <v-toolbar-title>{{ selectedCount }} sélectionné(s)</v-toolbar-title>
    <v-btn @click="deleteSelected">Supprimer</v-btn>
  </v-toolbar>
</template>
```

## Architecture

Le layer est construit comme ceci :

### DataTable
-  DataTableState  : Gestion de l'état
-  DataTableSorting  : Logique de tri
-  DataTablePagination  : Logique de pagination
-  DataTableSelection  : Logique de sélection
-  BaseDataTable  : Orchestration

### ServerDataTable
-  ServerDataTableState  : Gestion de l'état serveur
-  ServerDataTableFetching  : Appels API et abort
-  ServerDataTableFilters  : Recherche et filtres avec debounce
-  ApiPayloadBuilder  : Construction des payloads
- Réutilise les modules de tri, pagination et sélection
