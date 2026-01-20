import type { Locale } from 'date-fns'

export interface DateRange {
    start: Date | null
    end: Date | null
}

export interface FormattedRange {
    start: string | null
    end: string | null
}

export interface ISORange {
    start: string | null
    end: string | null
}

export type DateTimeMode = 'date' | 'datetime' | 'range'

export interface DateTimeError {
    type: 'min' | 'max' | 'range' | 'invalid'
    message: string
}

export interface DateTimeOptions {
    mode: DateTimeMode
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
