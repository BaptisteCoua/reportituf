# Form XEFI Module

Module de gestion de formulaires avec validation, collections dynamiques et soumission.

## Installation

```bash
pnpm add @reportit/form-xefi
```

## Fonctionnalités

- Définition déclarative des champs
- Validation avec règles personnalisables
- Collections dynamiques (min/max items)
- Formatage des données avant soumission
- Gestion des erreurs serveur
- État dirty/loading

## Utilisation

### Créer un formulaire
```typescript
import { Form } from '@reportit/form-xefi'

class UserForm extends Form {
  fields = {
    username: { name: 'username', value: '' },
    email: { name: 'email', value: '' },
    password: { name: 'password', value: '' }
  }

  collections = {
    addresses: {
      min: 1,
      max: 3,
      template: {
        street: { name: 'street', value: '' },
        city: { name: 'city', value: '' }
      }
    }
  }

  rules() {
    return {
      username: [
        (val) => !!val || 'Le nom est requis',
        (val) => val.length >= 3 || 'Minimum 3 caractères'
      ],
      email: [
        (val) => !!val || "L'email est requis",
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email invalide'
      ],
      password: [
        (val) => !!val || 'Le mot de passe est requis',
        (val) => val.length >= 8 || 'Minimum 8 caractères'
      ]
    }
  }

  format(fields: any) {
    return {
      username: fields.username.value,
      email: fields.email.value,
      password: fields.password.value,
      addresses: fields.addresses.map((addr: any) => ({
        street: addr.street.value,
        city: addr.city.value
      }))
    }
  }

  formatErrorMessages(error: any) {
    return error.response?.data?.errors || {}
  }

  async onSubmit(formattedData: any) {
    return await api.createUser(formattedData)
  }
}
```

### Utiliser le formulaire
```typescript
const useUserForm = new UserForm().composable()

// Dans un composant
const { fields, submit, isValid, reset, addCollectionItem, removeCollectionItem } = useUserForm()
```

### Dans un template Vue
```vue
<template>
  <form @submit.prevent="submit">
    <input
      v-model="fields.username.value"
      @blur="fields.username.validate"
    />
    <span v-for="error in fields.username.errors">{{ error }}</span>

    <input v-model="fields.email.value" />
    <input v-model="fields.password.value" type="password" />

    <!-- Collections -->
    <div v-for="(address, index) in fields.addresses" :key="index">
      <input v-model="address.street.value" />
      <input v-model="address.city.value" />
      <button @click="removeCollectionItem('addresses', index)">
        Supprimer
      </button>
    </div>
    <button @click="addCollectionItem('addresses')">
      Ajouter une adresse
    </button>

    <button type="submit" :disabled="!isValid">Soumettre</button>
  </form>
</template>
```

## API

### Classe Form (abstraite)

#### Propriétés à implémenter
- `fields` : Définition des champs du formulaire
- `collections?` : Définition des collections dynamiques
- `rules()` : Règles de validation
- `format(fields)` : Formatage avant soumission
- `formatErrorMessages(error)` : Formatage des erreurs serveur
- `onSubmit(data)` : Action de soumission

### Composable retourné

- `fields` : Ref des champs du formulaire
- `submit()` : Soumettre le formulaire
- `checkRules(applyError?)` : Valider les règles
- `isValid` : ComputedRef de validité
- `reset()` : Réinitialiser le formulaire
- `addCollectionItem(name)` : Ajouter un item à une collection
- `removeCollectionItem(name, index)` : Supprimer un item

### Structure d'un champ

```typescript
interface Field {
  name: string
  value?: any
  errors?: string[]
  validate?: () => void
}
```

### Structure d'une collection

```typescript
{
  min: number,
  max: number,
  template: Fields
}
```
