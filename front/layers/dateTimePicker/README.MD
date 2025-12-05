# DateTimePicker Layer

Un composable réutilisable et framework-agnostic pour gérer la sélection de dates et heures avec validation, formatage et support des fuseaux horaires.

## Installation

Ajoutez le layer dans votre configuration Nuxt :

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['./layers/datetimepicker']
})
```

## Dépendances

Ce layer requiert date-fns :

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
import { useDateTimePicker } from '~/layers/datetimepicker/composables'

const { 
  selectedDate, 
  formattedValue,
  setDate 
} = useDateTimePicker({
  mode: 'single',
  dateTimeMode: 'date'
})

// Sélectionner une date
setDate(new Date())

// Afficher la date formatée
console.log(formattedValue.value) // "2025-01-15"
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

console.log(formattedValue.value) // "15/01/2025 14:30"
console.log(isoValue.value)       // "2025-01-15T14:30:00.000Z"
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
  console.log(formattedValue.value.start) // "2025-01-15"
  console.log(formattedValue.value.end)   // "2025-02-15"
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
  locale?: Locale           // de date-fns
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
  console.log(error.value.message) // "La date est antérieure à la date minimale"
}
```

### Avec correction automatique

```typescript
const { setDate } = useDateTimePicker({
  mode: 'single',
  minDate: new Date(),
  autoCorrect: true
})

// La date sera automatiquement corrigée à minDate si elle est antérieure
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
console.log(formattedValue.value) // "mercredi 15 janvier 2025"
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

// Envoi à l'API
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

// Récupération depuis l'API
const response = await $fetch('/api/events/123')
const localDate = toLocal()
setDate(localDate)
```

## Méthodes disponibles

### État
- `selectedDate` : Date sélectionnée (mode single)
- `selectedTime` : Heure sélectionnée (mode datetime)
- `selectedDates` : Dates sélectionnées (mode multiple)
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
- `setMode(mode)` : Changer le mode
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
<template>
  <UInput
    type="date"
    :model-value="selectedDate"
    @update:model-value="setDate"
  />
</template>
```

## Architecture

Le composable est construit comme suit :

- **DateTimeState** : Gestion de l'état (dates, configuration)
- **DateTimeValidation** : Validation et correction des dates
- **DateTimeFormatting** : Formatage et parsing des dates
- **BaseDateTimePicker** : Orchestration des couches
```
