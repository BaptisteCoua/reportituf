# Products Layer

Domaine produits utilisant l'approche POO (classes).

## Lancer

```bash
pnpm dev
```

Accès : http://localhost:3000/products

## Tests

```bash
cd layers/products && npx vitest run
```

## Structure

```
products/
├── services/          # Appels API
├── composables/       # useProductTable, useProductForm
├── components/        # Atomic design
├── pages/             # /products
└── tests/
```

## Approche POO

Ici on instancie des classes directement dans les composables :

```ts
// useProductTable.ts
const table = new ServerDataTable<Product>(options)

return {
  items: table.getItems(),
  setPage: table.setPage.bind(table),
  // ...
}
```

```ts
// useProductForm.ts
const availableFromPicker = new DateTimePicker({
  mode: 'single',
  dateTimeMode: 'datetime'
})
```

### Pourquoi bind() ?

Quand on extrait une méthode d'une classe pour la retourner, elle perd son contexte `this`. Le `bind(table)` force le contexte.

### Modules utilisés

- `datatable-v2` : classe `ServerDataTable`
- `date-time-picker` : classe `DateTimePicker`

## Différence avec Users (Define)

| Aspect | Products (POO) | Users (Define) |
|--------|----------------|----------------|
| Instanciation | `new ServerDataTable()` | `defineServerDataTable()` |
| État | Dans la classe | Dans des refs via closure |
| Méthodes | `table.setPage.bind(table)` | Retournées directement |
| Testabilité | Mock des classes | Mock des fonctions |
| Bundle | Plus lourd (classes) | Plus léger |

L'approche POO est plus verbeuse mais plus structurée pour des cas complexes. L'approche Define est plus légère et idiomatique Vue.
