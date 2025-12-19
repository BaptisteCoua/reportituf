# DateTimePicker Module

Un module POO réutilisable pour gérer la sélection de dates et heures avec validation, formatage et support des fuseaux horaires.

## Installation

Ajoutez le module dans votre projet Nuxt :
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['~/modules/date-time-picker']
})
```

## Dépendances

Ce module requiert date-fns :
```bash
npm install date-fns date-fns-tz
```

## Fonctionnalités

- Sélection de date simple, plage de dates ou dates multiples
- Support optionnel de l'heure
- Validation avec min/max date
- Correction automatique optionnelle
- Formatage personnalisable avec date-fns
- Support des fuseaux horaires
- Support des locales (français, anglais, etc.)
- Conversion UTC/Local
- Gestion des erreurs de validation

## Utilisation de base

### Date simple
```typescript
import { useDateTimePicker } from '~/modules/date-time-picker'

const { 
  selectedDate, 
  formattedValue,
  setDate 
} = useDateTimePicker({
  mode: 'single',
  dateTimeMode: 'date'
})

setDate(new Date())

console.log(formattedValue.value)
```

### Date et heure
```typescript
const { 
  selectedDate,
  selectedTime,
  formattedValue,
  isoValue,
  setDate,
  setTime
} = useDateTimePicker({
  mode: 'single',
  dateTimeMode: 'datetime',
  format: 'dd/MM/yyyy HH:mm'
})

setDate(new Date())
setTime('14:30')

console.log(formattedValue.value)
console.log(isoValue.value)
```

### Plage de dates
```typescript
import { addMonths } from 'date-fns'

const { 
  dateRange,
  formattedValue,
  setDateRange,
  error,
  isValid
} = useDateTimePicker({
  mode: 'range',
  minDate: new Date(),
  maxDate: addMonths(new Date(), 6)
})

setDateRange(new Date(), addMonths(new Date(), 1))

if (isValid.value) {
  console.log(formattedValue.value.start)
  console.log(formattedValue.value.end)
}
```

## Utilisation avancée avec POO

### Avec le composable (Recommandé)
```typescript
const picker = useDateTimePicker({
  mode: 'single',
  dateTimeMode: 'date',
  autoCorrect: true
})
```

### Avec la classe directement
```typescript
import { DateTimePicker } from '~/modules/date-time-picker'

const picker = new DateTimePicker({
  mode: 'single',
  dateTimeMode: 'datetime',
  format: 'yyyy-MM-dd HH:mm'
})

picker.setDate('2024-01-15')
picker.setTime('14:30')

console.log(picker.getFormattedValue().value)
console.log(picker.getISOValue().value)
```

### Utilisation des classes internes
```typescript
import { DateTimeState, DateTimeValidator, DateTimeFormatter } from '~/modules/date-time-picker'

const state = new DateTimeState({ mode: 'single' })
const validator = new DateTimeValidator(state)
const formatter = new DateTimeFormatter(state)

state.setSelectedDate(new Date())

if (validator.isValid().value) {
  console.log(formatter.getFormattedValue().value)
}
```

## Options de configuration
```typescript
interface DateTimePickerOptions {
  mode?: 'single' | 'range' | 'multiple'
  dateTimeMode?: 'date' | 'datetime' | 'time'
  minDate?: Date
  maxDate?: Date
  timezone?: string
  locale?: Locale
  format?: string
  autoCorrect?: boolean
  defaultToNow?: boolean
}
```

## Validation

### Avec erreurs
```typescript
const { 
  selectedDate,
  error,
  isValid,
  validate,
  setDate
} = useDateTimePicker({
  mode: 'single',
  minDate: new Date(),
  maxDate: addMonths(new Date(), 3),
  autoCorrect: false
})

setDate(new Date('2020-01-01'))

if (error.value) {
  console.log(error.value.message)
}
```

### Avec correction automatique
```typescript
const { setDate } = useDateTimePicker({
  mode: 'single',
  minDate: new Date(),
  autoCorrect: true
})

setDate(new Date('2020-01-01'))
```

## Formatage

### Formats personnalisés
```typescript
const { formattedValue, setFormat } = useDateTimePicker({
  mode: 'single',
  format: 'EEEE dd MMMM yyyy'
})

setDate(new Date('2025-01-15'))
console.log(formattedValue.value)
```

### Locales
```typescript
import { fr } from 'date-fns/locale'

const { formattedValue } = useDateTimePicker({
  mode: 'single',
  locale: fr,
  format: 'EEEE dd MMMM yyyy'
})
```

## Fuseaux horaires

### Conversion UTC
```typescript
const { 
  selectedDate,
  toUTC,
  setDate
} = useDateTimePicker({
  mode: 'single',
  timezone: 'Europe/Paris'
})

setDate(new Date('2025-01-15T14:30:00'))
const utcDate = toUTC()

await $fetch('/api/events', {
  method: 'POST',
  body: {
    eventDate: utcDate?.toISOString()
  }
})
```

### Conversion locale
```typescript
const { toLocal, setDate } = useDateTimePicker({
  mode: 'single',
  timezone: 'Europe/Paris'
})

const response = await $fetch('/api/events/123')
const localDate = toLocal()
setDate(localDate)
```

## API

### État

- `selectedDate` : Date sélectionnée (mode single)
- `selectedTime` : Heure sélectionnée (mode datetime)
- `dateRange` : Plage de dates (mode range)
- `mode` : Mode de sélection
- `dateTimeMode` : Mode date/datetime/time
- `error` : Erreur de validation
- `isValid` : Validation complète
- `formattedValue` : Valeur formatée
- `isoValue` : Valeur au format ISO 8601

### Actions

- `setDate(date)` : Définir la date
- `setTime(time)` : Définir l'heure
- `setDateRange(start, end)` : Définir une plage
- `setMinDate(date)` : Définir date minimale
- `setMaxDate(date)` : Définir date maximale
- `setTimezone(timezone)` : Changer le fuseau horaire
- `setLocale(locale)` : Changer la locale
- `setFormat(format)` : Changer le format
- `validate()` : Valider manuellement
- `reset()` : Réinitialiser la sélection
- `clear()` : Tout effacer
- `toUTC()` : Convertir en UTC
- `toLocal()` : Convertir en local

## Exemples d'intégration

### Avec Vuetify
```vue
<script setup lang="ts">
import { useDateTimePicker } from '~/modules/date-time-picker'

const { selectedDate, selectedTime, error, dateTimeMode, setDate, setTime } = useDateTimePicker({
  mode: 'single',
  dateTimeMode: 'datetime'
})
</script>

<template>
  <v-date-picker
    :model-value="selectedDate"
    @update:model-value="setDate"
  />
  <v-text-field
    v-if="dateTimeMode === 'datetime'"
    :model-value="selectedTime"
    type="time"
    @update:model-value="setTime"
  />
  <p v-if="error">{{ error.message }}</p>
</template>
```

### Avec PrimeVue
```vue
<script setup lang="ts">
import { useDateTimePicker } from '~/modules/date-time-picker'

const { selectedDate, setDate } = useDateTimePicker({
  mode: 'single',
  format: 'dd/MM/yyyy'
})
</script>

<template>
  <Calendar
    :model-value="selectedDate"
    @update:model-value="setDate"
    date-format="dd/mm/yy"
  />
</template>
```

### Avec NuxtUI
```vue
<script setup lang="ts">
import { useDateTimePicker } from '~/modules/date-time-picker'

const { selectedDate, setDate } = useDateTimePicker({
  mode: 'single'
})
</script>

<template>
  <UInput
    type="date"
    :model-value="selectedDate"
    @update:model-value="setDate"
  />
</template>
```

## Architecture

Le module est construit en POO avec séparation des responsabilités :

- **DateTimePicker** : Classe principale orchestrant l'ensemble
- **DateTimeState** : Gestion de l'état réactif (dates, configuration)
- **DateTimeValidator** : Validation et correction des dates
- **DateTimeFormatter** : Formatage et parsing des dates
- **utils/** : Fonctions utilitaires pures (format, validation)

### Structure du module
```
modules/date-time-picker/
├── src/
│   ├── DateTimePicker.ts         # Classe principale
│   ├── DateTimeState.ts          # Gestion d'état
│   ├── DateTimeValidator.ts      # Validation
│   ├── DateTimeFormatter.ts      # Formatage
│   ├── composables/
│   │   └── useDateTimePicker.ts  # Composable Nuxt
│   ├── utils/
│   │   ├── format.ts
│   │   └── validation.ts
│   └── types/
│       └── index.ts
└── tests/
```

## Conventions de code

- **Booléens d'état** : Préfixés par `is` (ex: `isAutoCorrect`, `isValid`)
- **IDs CSS** : Format `kebab-case`
- **Pas de commentaires** dans le code (code auto-documenté)
- **Tests** : Vitest avec Vue Test Utils

## Tests

Le module inclut une suite de tests complète :
```bash
npm test
npm run test:ui
npm run test:coverage
```

### Couverture des tests

- ✅ DateTimePicker (classe principale)
- ✅ DateTimeState (gestion d'état)
- ✅ DateTimeValidator (validation)
- ✅ DateTimeFormatter (formatage)
- ✅ utils/format (utilitaires de formatage)
- ✅ utils/validation (utilitaires de validation)

## Roadmap & Évolutions

### Publication NPM

Pr
