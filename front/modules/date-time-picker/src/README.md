# Date Time Picker Module

Module POO pour faciliter la gestion des date time pickers dans vos applications Nuxt.

## Installation

```bash
npm install @your-org/date-time-picker
```

## Utilisation

### Avec le composable (Recommandé)

```vue
<script setup lang="ts">
import { useDateTimePicker } from '@your-org/date-time-picker'

const picker = useDateTimePicker({
  mode: 'single',
  dateTimeMode: 'date',
  format: 'dd/MM/yyyy',
  autoCorrect: true,
  minDate: new Date('2024-01-01'),
  maxDate: new Date('2024-12-31')
})

function handleDateChange(date: Date) {
  picker.setDate(date)
}
</script>

<template>
  <div>
    <input 
      type="date" 
      :value="picker.formattedValue.value"
      @change="handleDateChange"
    />
    <p v-if="picker.error.value">{{ picker.error.value.message }}</p>
  </div>
</template>
```

### Avec la classe directement

```ts
import { DateTimePicker } from '@your-org/date-time-picker'

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

## API

### Options

```ts
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

### Méthodes principales

#### Getters

- `getSelectedDate()` - Date sélectionnée
- `getSelectedTime()` - Heure sélectionnée
- `getDateRange()` - Plage de dates
- `getMode()` - Mode du picker
- `getDateTimeMode()` - Mode date/time
- `getError()` - Erreur de validation
- `isValid()` - Validation booléenne
- `getFormattedValue()` - Valeur formatée
- `getISOValue()` - Valeur au format ISO

#### Setters

- `setDate(date)` - Définir une date
- `setTime(time)` - Définir une heure
- `setDateRange(start, end)` - Définir une plage
- `setMinDate(date)` - Définir date minimale
- `setMaxDate(date)` - Définir date maximale
- `setTimezone(timezone)` - Définir le timezone
- `setLocale(locale)` - Définir la locale
- `setFormat(format)` - Définir le format

#### Utilitaires

- `toUTC()` - Convertir en UTC
- `toLocal()` - Convertir en local
- `validate()` - Valider manuellement
- `reset()` - Réinitialiser
- `clear()` - Tout effacer

## Exemples

### Mode Range

```ts
const rangePicker = useDateTimePicker({ mode: 'range' })

rangePicker.setDateRange('2024-01-01', '2024-01-31')

console.log(rangePicker.dateRange.value)
```

### Auto-correction

```ts
const picker = useDateTimePicker({
  autoCorrect: true,
  minDate: new Date('2024-01-01'),
  maxDate: new Date('2024-12-31')
})

picker.setDate('2023-12-15')

console.log(picker.getSelectedDate().value)
```

### Timezone

```ts
const picker = useDateTimePicker({ timezone: 'Europe/Paris' })

picker.setDate('2024-01-15')

console.log(picker.toUTC())
console.log(picker.toLocal())
```

## Tests

```bash
npm test
npm run test:ui
npm run test:coverage
```

## Architecture

Le module est structuré en POO avec séparation des responsabilités :

- **DateTimePicker** : Classe principale orchestrant l'ensemble
- **DateTimeState** : Gestion de l'état réactif
- **DateTimeValidator** : Logique de validation
- **DateTimeFormatter** : Logique de formatage
- **utils/** : Fonctions utilitaires pures

## Conventions

- Booléens d'état : `isVariable` (ex: `isAutoCorrect`)
- IDs CSS : `kebab-case`
- Pas de commentaires dans le code
- Tests avec Vitest et Vue Test Utils

## License

MIT
