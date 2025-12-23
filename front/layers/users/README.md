# Users Layer

Domaine utilisateurs utilisant l'approche Define (fonctionnelle).

## Lancer

```bash
pnpm dev
```

Accès : http://localhost:3000/users

## Tests

```bash
cd layers/users && npx vitest run
```

## Structure

```
users/
├── services/          # Appels API
├── composables/       # useUserTable, useUserForm
├── components/        # Atomic design
├── pages/             # /users
└── tests/
```

## Approche Define

On utilise une fonction factory qui retourne un composable :

```ts
// useUserTable.ts
export const useUserTable = defineServerDataTable<User>('users-table', {
  headers,
  fetchFn: async (payload) => { /* ... */ }
})
```

C'est tout. Pas de `new`, pas de `bind()`, pas de classe.

Dans la page :

```ts
const table = useUserTable()

table.setSearch('john')
await table.setPage(2)
```

### Comment ça marche ?

`defineServerDataTable` crée une instance unique (singleton) identifiée par l'ID `'users-table'`. À chaque appel de `useUserTable()`, on récupère la même instance.

L'état est stocké dans des `ref()` via closure, les méthodes sont retournées directement sans avoir besoin de `bind()`.

### Modules utilisés

- `datatable-define` : fonction `defineServerDataTable`
- `datetime-define` : fonctions `defineDate`, `defineDatetime`

## Différence avec Products (POO)

| Aspect | Users (Define) | Products (POO) |
|--------|----------------|----------------|
| Style | Fonctionnel | Orienté objet |
| Code | Moins de boilerplate | Plus structuré |
| Vue | Idiomatique | Wrapper nécessaire |
| Performance | Plus léger | Plus lourd |

L'approche Define colle mieux à la philosophie Vue 3 Composition API. C'est plus simple pour des cas standards.
