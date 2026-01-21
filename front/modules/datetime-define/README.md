# DateTime Define Module

Module pour industrialiser la gestion des date/time pickers Vuetify avec API typee selon le mode.

## Installation

```bash
pnpm add @reportituf/datetime-define
```

## Utilisation

### Mode Date

```typescript
// composables/useBirthDatePicker.ts
import { defineDateTime } from '@reportituf/datetime-define'

export const useBirthDatePicker = defineDateTime<[]>(() => ({
    mode: 'date',
    maxDate: new Date(),
}))
```

```vue
<script setup>
const { date, setDate, isValid, reset } = useBirthDatePicker()
</script>

<template>
    <v-date-picker v-model="date" />
</template>
```

### Mode Datetime

```typescript
// composables/useEventDateTimePicker.ts
import { defineDateTime } from '@reportituf/datetime-define'

export const useEventDateTimePicker = defineDateTime<[]>(() => ({
    mode: 'datetime',
    minDate: new Date(),
}))
```

```vue
<script setup>
const { date, time, combined, setDate, setTime, setDateTime, isValid, reset } = useEventDateTimePicker()
</script>

<template>
    <v-date-picker v-model="date" />
    <v-time-picker v-model="time" />
    <p>Combined: {{ combined }}</p>
</template>
```

### Mode Range

```typescript
// composables/useAvailabilityRangePicker.ts
import { defineDateTime } from '@reportituf/datetime-define'

export const useAvailabilityRangePicker = defineDateTime<[]>(() => ({
    mode: 'range',
    minDate: new Date(),
}))
```

```vue
<script setup>
const { start, end, setStart, setEnd, setRange, isValid, reset } = useAvailabilityRangePicker()
</script>

<template>
    <v-date-picker v-model="start" />
    <v-date-picker v-model="end" />
</template>
```

## API

### Config

```typescript
interface DateConfig {
    mode: 'date'
    minDate?: Date | null
    maxDate?: Date | null
}

interface DateTimeConfig {
    mode: 'datetime'
    minDate?: Date | null
    maxDate?: Date | null
}

interface RangeConfig {
    mode: 'range'
    minDate?: Date | null
    maxDate?: Date | null
}
```

### Retour Mode Date

```typescript
interface DateReturn {
    date: Ref<Date | null>
    minDate: Ref<Date | null>
    maxDate: Ref<Date | null>
    isValid: ComputedRef<boolean>
    setDate: (value: Date | null) => void
    setMinDate: (value: Date | null) => void
    setMaxDate: (value: Date | null) => void
    reset: () => void
}
```

### Retour Mode Datetime

```typescript
interface DateTimeReturn {
    date: Ref<Date | null>
    time: Ref<string | null>
    combined: ComputedRef<Date | null>
    minDate: Ref<Date | null>
    maxDate: Ref<Date | null>
    isValid: ComputedRef<boolean>
    setDate: (value: Date | null) => void
    setTime: (value: string | null) => void
    setDateTime: (date: Date | null, time: string | null) => void
    setMinDate: (value: Date | null) => void
    setMaxDate: (value: Date | null) => void
    reset: () => void
}
```

### Retour Mode Range

```typescript
interface RangeReturn {
    start: Ref<Date | null>
    end: Ref<Date | null>
    minDate: Ref<Date | null>
    maxDate: Ref<Date | null>
    isValid: ComputedRef<boolean>
    setStart: (value: Date | null) => void
    setEnd: (value: Date | null) => void
    setRange: (start: Date | null, end: Date | null) => void
    setMinDate: (value: Date | null) => void
    setMaxDate: (value: Date | null) => void
    reset: () => void
}
```

## Arguments dynamiques

```typescript
// Avec argument pour minDate dynamique
const useEventPicker = defineDateTime<[Date]>(minDate => ({
    mode: 'datetime',
    minDate,
}))

// Utilisation
const picker = useEventPicker(new Date())
```

## Validation

`isValid` est un computed qui verifie automatiquement :
- Mode date : date non null et dans les limites min/max
- Mode datetime : combined non null et dans les limites
- Mode range : start et end non null, start <= end, dans les limites

## Types exportes

```typescript
export { defineDateTime } from './defineDateTime'
export type {
    DateConfig,
    DateTimeConfig,
    RangeConfig,
    DateReturn,
    DateTimeReturn,
    RangeReturn,
} from './types'
```
