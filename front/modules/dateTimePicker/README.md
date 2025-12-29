# DateTimePicker Module (Legacy)

Module Nuxt pour la gestion des dates et heures avec une architecture basée sur des classes.

## Installation

```bash
pnpm add @reportit/dateTimePicker
```

Ajoutez le module dans votre configuration Nuxt :
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@reportit/dateTimePicker']
})
```

## Fonctionnalités

- Sélection de date simple ou plage
- Support date + heure
- Validation avec min/max dates
- Formatage personnalisable
- Support des fuseaux horaires
- Architecture modulaire basée sur des classes

## Utilisation

### Composable useDateTimePicker
```typescript
import { useDateTimePicker } from '@reportit/dateTimePicker'

const {
  selectedDate,
  selectedTime,
  dateRange,
  mode,
  dateTimeMode,
  error,
  isValid,
  formattedValue,
  isoValue,
  setDate,
  setTime,
  setDateRange,
  setMinDate,
  setMaxDate,
  setTimezone,
  validate,
  reset,
  clear
} = useDateTimePicker({
  mode: 'single',
  dateTimeMode: 'datetime',
  format: 'dd/MM/yyyy HH:mm'
})
```

### Utiliser la classe directement
```typescript
import { BaseDateTimePicker } from '@reportit/dateTimePicker'

const picker = new BaseDateTimePicker({
  mode: 'single',
  dateTimeMode: 'date'
})

picker.setDate(new Date())
console.log(picker.getFormattedValue().value)
```

## Architecture

Le module est construit avec des classes modulaires :

- `DateTimeState` : Gestion de l'état réactif
- `DateTimeFormatting` : Formatage et parsing
- `DateTimeValidation` : Validation des dates
- `BaseDateTimePicker` : Classe principale qui orchestre les autres

### Utilitaires

```typescript
// Format
import { formatDate, formatTime, formatRange } from '@reportit/dateTimePicker/utils/format'

// Validation
import { isValidDate, isDateInRange } from '@reportit/dateTimePicker/utils/validation'
```

## Options de configuration

```typescript
interface DateTimePickerOptions {
  mode?: 'single' | 'range'
  dateTimeMode?: 'date' | 'datetime' | 'time'
  format?: string
  minDate?: Date
  maxDate?: Date
  defaultToNow?: boolean
  autoCorrect?: boolean
  timezone?: string
  locale?: Locale
}
```

## Exports

```typescript
export * from './types'
export * from './utils'
export { BaseDateTimePicker } from './BaseDateTimePicker'
export { useDateTimePicker } from './index'
```
