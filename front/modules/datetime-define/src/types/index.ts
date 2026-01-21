import type { Ref, ComputedRef } from 'vue'

export interface DateConfig {
    mode: 'date'
    minDate?: Date | null
    maxDate?: Date | null
}

export interface DateTimeConfig {
    mode: 'datetime'
    minDate?: Date | null
    maxDate?: Date | null
}

export interface RangeConfig {
    mode: 'range'
    minDate?: Date | null
    maxDate?: Date | null
}

export interface DateReturn {
    date: Ref<Date | null>
    minDate: Ref<Date | null>
    maxDate: Ref<Date | null>
    isValid: ComputedRef<boolean>
    setDate: (value: Date | null) => void
    setMinDate: (value: Date | null) => void
    setMaxDate: (value: Date | null) => void
    reset: () => void
}

export interface DateTimeReturn {
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

export interface RangeReturn {
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
