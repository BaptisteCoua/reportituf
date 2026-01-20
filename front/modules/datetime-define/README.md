# DateTime Define Module

Module avec l'API `defineDateTime` pour créer des instances de sélecteurs de dates réutilisables et enregistrées globalement.

## Installation

```bash
pnpm add @reportit/datetime-define
```

## Fonctionnalités

- `defineDateTime` : Crée un composable réutilisable avec mode configurable ('date' | 'datetime' | 'range')
- Registry global pour partager les instances entre composants
- Utilitaires de formatage et validation inclus
- Gestion automatique des timezones et locales
- Validation et correction automatique des dates

## Utilisation

### Mode Date

```typescript
import { defineDateTime } from '@reportit/datetime-define'

// Définir le picker une fois
export const useBirthDatePicker = defineDateTime('birthdate', {
  mode: 'date',
  format: 'dd/MM/yyyy',
  maxDate: new Date(),
  autoCorrect: true
})

// Utiliser dans n'importe quel composant
const { selectedDate, setDate, formattedValue, isValid } = useBirthDatePicker()
```

### Mode Datetime

```typescript
import { defineDateTime } from '@reportit/datetime-define'

export const useAppointmentPicker = defineDateTime('appointment', {
  mode: 'datetime',
  format: 'dd/MM/yyyy HH:mm',
  minDate: new Date(),
  timezone: 'Europe/Paris'
})

const {
  selectedDate,
  selectedTime,
  combinedDateTime,
  setDate,
  setTime,
  setDateTime,
  isoValue
} = useAppointmentPicker()
```

### Mode Range

```typescript
import { defineDateTime } from '@reportit/datetime-define'

export const useReportPeriod = defineDateTime('report-period', {
  mode: 'range',
  format: 'dd/MM/yyyy',
  defaultToNow: false
})

const {
  startDate,
  endDate,
  dateRange,
  setStartDate,
  setEndDate,
  setDateRange,
  isValid
} = useReportPeriod()

setDateRange(new Date('2024-01-01'), new Date('2024-12-31'))
```

## Options

```typescript
interface DateTimeOptions {
  mode: 'date' | 'datetime' | 'range'
  initialDate?: Date | null
  initialTime?: string | null
  initialRange?: DateRange
  minDate?: Date
  maxDate?: Date
  timezone?: string
  locale?: Locale
  format?: string
  autoCorrect?: boolean
  defaultToNow?: boolean
}
```

## API de retour

### Mode 'date'

```typescript
{
  selectedDate: ComputedRef<Date | null>
  formattedValue: ComputedRef<string | null>
  isoValue: ComputedRef<string | null>
  error: ComputedRef<DateTimeError | null>
  isValid: ComputedRef<boolean>
  minDate: ComputedRef<Date | null>
  maxDate: ComputedRef<Date | null>
  format: ComputedRef<string>
  timezone: ComputedRef<string>
  mode: ComputedRef<DateTimeMode>
  setDate: (date: Date | string | null) => void
  setMinDate: (date: Date | null) => void
  setMaxDate: (date: Date | null) => void
  setTimezone: (timezone: string) => void
  setLocale: (locale: Locale) => void
  setFormat: (format: string) => void
  toUTC: () => Date | null
  toLocal: () => Date | null
  validate: () => boolean
  reset: () => void
  clear: () => void
}
```

### Mode 'datetime'

Retourne tous les champs du mode 'date' plus :

```typescript
{
  selectedTime: ComputedRef<string | null>
  combinedDateTime: ComputedRef<Date | null>
  setTime: (time: string | null) => void
  setDateTime: (date: Date | string | null, time: string | null) => void
}
```

### Mode 'range'

```typescript
{
  startDate: ComputedRef<Date | null>
  endDate: ComputedRef<Date | null>
  dateRange: ComputedRef<DateRange>
  formattedValue: ComputedRef<FormattedRange | null>
  isoValue: ComputedRef<ISORange | null>
  error: ComputedRef<DateTimeError | null>
  isValid: ComputedRef<boolean>
  minDate: ComputedRef<Date | null>
  maxDate: ComputedRef<Date | null>
  format: ComputedRef<string>
  mode: ComputedRef<DateTimeMode>
  setStartDate: (date: Date | string | null) => void
  setEndDate: (date: Date | string | null) => void
  setDateRange: (start: Date | string | null, end: Date | string | null) => void
  setMinDate: (date: Date | null) => void
  setMaxDate: (date: Date | null) => void
  setLocale: (locale: Locale) => void
  setFormat: (format: string) => void
  validate: () => boolean
  reset: () => void
  clear: () => void
}
```

## Utilitaires de formatage

```typescript
import {
  formatDate,
  parseDate,
  toISO,
  toUTC,
  toLocalDate,
  combineDateTime,
  extractTime
} from '@reportit/datetime-define'

// Formater une date
const formatted = formatDate(new Date(), 'dd/MM/yyyy')

// Parser une chaîne
const date = parseDate('23/12/2024', 'dd/MM/yyyy')

// Convertir en ISO
const iso = toISO(new Date()) // "2024-12-23T00:00:00.000Z"

// Combiner date et heure
const datetime = combineDateTime(date, '14:30')

// Extraire l'heure d'une date
const time = extractTime(new Date()) // "14:30"
```

## Utilitaires de validation

```typescript
import {
  isValidDate,
  isDateInRange,
  isRangeValid,
  validateDateTime,
  validateRange,
  correctDate
} from '@reportit/datetime-define'

// Vérifier validité
if (isValidDate(date)) {
  // ...
}

// Vérifier si dans une plage
if (isDateInRange(date, minDate, maxDate)) {
  // ...
}

// Valider un range
if (isRangeValid(startDate, endDate)) {
  // ...
}

// Corriger automatiquement
const corrected = correctDate(date, minDate, maxDate)
```

## Registry

```typescript
import { hasDateTime, clearDateTimeRegistry } from '@reportit/datetime-define'

// Vérifier si un picker existe
if (hasDateTime('birthdate')) {
  // ...
}

// Nettoyer le registry (utile pour les tests)
clearDateTimeRegistry()
```

## Types exportés

```typescript
export type {
  DateRange,
  FormattedRange,
  ISORange,
  DateTimeMode,
  DateTimeError,
  DateTimeOptions
} from '@reportit/datetime-define'
```

## Migration depuis l'ancienne API

Si vous utilisiez les anciennes fonctions `defineDate`, `defineDatetime` ou `defineDateRange`, la migration est simple :

```typescript
// Ancien
defineDate('birthdate', { ... })
defineDatetime('appointment', { ... })
defineDateRange('report', { ... })

// Nouveau
defineDateTime('birthdate', { mode: 'date', ... })
defineDateTime('appointment', { mode: 'datetime', ... })
defineDateTime('report', { mode: 'range', ... })
```
