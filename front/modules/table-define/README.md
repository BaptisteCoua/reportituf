# Table Define Module

Module pour industrialiser la gestion des tableaux Vuetify avec refs reactives et watch automatique.

## Installation

```bash
pnpm add @reportituf/table-define
```

## Utilisation

### Definir un composable

```typescript
// composables/useUserTable.ts
import { defineTable } from '@reportituf/table-define'

interface User {
    id: number
    name: string
    email: string
}

export const useUserTable = defineTable<[string], User>(status => ({
    load: async ({ page, itemsPerPage, search, sorts, filters }) => {
        const res = await api.get('/users', {
            params: { page, limit: itemsPerPage, search, status, ...filters }
        })
        return { items: res.data.users, total: res.data.total }
    },
    itemsPerPage: 25,
}))
```

### Utiliser dans un composant

```vue
<script setup lang="ts">
const { items, page, itemsPerPage, sorts, search, total, isLoading, refresh } = useUserTable('active')

const headers = [
    { title: 'Nom', key: 'name', sortable: true },
    { title: 'Email', key: 'email' },
]
</script>

<template>
    <v-text-field v-model="search" label="Rechercher" />

    <v-data-table-server
        :items="items"
        :headers="headers"
        :items-length="total"
        :loading="isLoading"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        v-model:sort-by="sorts"
    />
</template>
```

## API

### Config

```typescript
interface TableConfig<T> {
    load: (body: TableBody) => Promise<{ items: T[]; total: number }>
    itemsPerPage?: number  // default: 10
    watch?: boolean        // default: true
}

interface TableBody {
    page: number
    itemsPerPage: number
    sorts: TableSort[]
    search: string
    filters: Record<string, unknown>
}
```

### Retour

```typescript
interface TableReturn<T> {
    // Donnees
    items: Ref<T[]>
    total: Ref<number>
    isLoading: Ref<boolean>

    // Refs reactives (bindables sur v-data-table-server)
    page: Ref<number>
    itemsPerPage: Ref<number>
    sorts: Ref<TableSort[]>
    search: Ref<string>
    filters: Ref<Record<string, unknown>>

    // Actions
    refresh: () => Promise<void>
    reset: () => void
}
```

## Watch automatique

Par defaut, le watch est actif :
- `page`, `itemsPerPage`, `sorts` : refresh immediat
- `search`, `filters` : refresh avec debounce 300ms + reset page a 1

Pour desactiver :

```typescript
const useUserTable = defineTable<[], User>(() => ({
    load: fetchUsers,
    watch: false,
}))
```

## Arguments dynamiques

```typescript
// Avec arguments
const useUserTable = defineTable<[string, number], User>((status, companyId) => ({
    load: async body => fetchUsers(body, status, companyId),
}))

// Utilisation
const table = useUserTable('active', 123)
```

## Refresh depuis ailleurs

```typescript
// Dans le composant principal
const { refresh } = useUserTable('active')

// Apres creation dans une modale
await createUser(data)
refresh()
```

## Types exportes

```typescript
export { defineTable } from './defineTable'
export type { TableSort, TableBody, TableConfig, TableReturn } from './types'
```
