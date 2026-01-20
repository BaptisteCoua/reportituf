import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { startOfDay } from 'date-fns'
import { registerDateTime } from './store/registry'
import {
    formatDate,
    parseDate,
    toISO,
    toUTC,
    toLocalDate,
    combineDateTime,
    extractTime,
} from './utils/format'
import {
    isValidDate,
    validateDateTime,
    validateRange,
    correctDate,
} from './utils/validation'
import type {
    DateTimeOptions,
    DateTimeMode,
    DateRange,
    DateTimeError,
    FormattedRange,
    ISORange,
} from './types'
import type { Locale } from 'date-fns'

interface DateTimeReturn {
    selectedDate?: ComputedRef<Date | null>
    selectedTime?: ComputedRef<string | null>
    combinedDateTime?: ComputedRef<Date | null>
    startDate?: ComputedRef<Date | null>
    endDate?: ComputedRef<Date | null>
    dateRange?: ComputedRef<DateRange>
    formattedValue: ComputedRef<string | FormattedRange | null>
    isoValue: ComputedRef<string | ISORange | null>
    error: ComputedRef<DateTimeError | null>
    isValid: ComputedRef<boolean>
    minDate: ComputedRef<Date | null>
    maxDate: ComputedRef<Date | null>
    format: ComputedRef<string>
    timezone?: ComputedRef<string>
    mode: ComputedRef<DateTimeMode>
    setDate?: (date: Date | string | null) => void
    setTime?: (time: string | null) => void
    setDateTime?: (date: Date | string | null, time: string | null) => void
    setStartDate?: (date: Date | string | null) => void
    setEndDate?: (date: Date | string | null) => void
    setDateRange?: (start: Date | string | null, end: Date | string | null) => void
    setMinDate: (date: Date | null) => void
    setMaxDate: (date: Date | null) => void
    setTimezone?: (timezone: string) => void
    setLocale: (locale: Locale) => void
    setFormat: (format: string) => void
    toUTC?: () => Date | null
    toLocal?: () => Date | null
    validate: () => boolean
    reset: () => void
    clear: () => void
}

function createDateTime(options: DateTimeOptions): DateTimeReturn {
    const mode = options.mode || 'date'

    const selectedDate: Ref<Date | null> = ref(
        mode === 'range'
            ? options.initialRange?.start || null
            : options.initialDate || null
    )

    const selectedTime: Ref<string | null> = ref(
        mode === 'datetime' ? options.initialTime || null : null
    )

    const startDate: Ref<Date | null> = ref(
        mode === 'range' ? options.initialRange?.start || null : null
    )

    const endDate: Ref<Date | null> = ref(
        mode === 'range' ? options.initialRange?.end || null : null
    )

    const minDate: Ref<Date | null> = ref(
        options.minDate || (options.defaultToNow ? startOfDay(new Date()) : null)
    )

    const maxDate: Ref<Date | null> = ref(options.maxDate || null)
    const timezone = ref(options.timezone || 'local')
    const locale: Ref<Locale | undefined> = ref(options.locale)

    const defaultFormat = {
        date: 'yyyy-MM-dd',
        datetime: 'yyyy-MM-dd HH:mm',
        range: 'yyyy-MM-dd',
    }

    const dateFormat = ref(options.format || defaultFormat[mode])
    const autoCorrect = options.autoCorrect || false
    const error: Ref<DateTimeError | null> = ref(null)

    const parseDateInput = (date: Date | string | null): Date | null => {
        if (!date) return null
        if (date instanceof Date) return date
        return parseDate(date)
    }

    const validateAndCorrectDate = (date: Date): Date | null => {
        if (!isValidDate(date)) {
            error.value = { type: 'invalid', message: 'Invalid date' }
            return null
        }

        const validationError = validateDateTime(date, minDate.value, maxDate.value)

        if (validationError) {
            if (autoCorrect) {
                const corrected = correctDate(date, minDate.value, maxDate.value)
                error.value = null
                return corrected
            }
            error.value = validationError
            return null
        }

        error.value = null
        return date
    }

    const validateAndCorrectRange = (
        start: Date | null,
        end: Date | null
    ): DateRange | null => {
        if (!start && !end) {
            error.value = null
            return { start: null, end: null }
        }

        if (start && !isValidDate(start)) {
            error.value = { type: 'invalid', message: 'Invalid start date' }
            return null
        }

        if (end && !isValidDate(end)) {
            error.value = { type: 'invalid', message: 'Invalid end date' }
            return null
        }

        const validationError = validateRange(start, end, minDate.value, maxDate.value)

        if (validationError) {
            if (autoCorrect && start && end) {
                const correctedStart = correctDate(start, minDate.value, maxDate.value)
                const correctedEnd = correctDate(end, minDate.value, maxDate.value)
                error.value = null
                return { start: correctedStart, end: correctedEnd }
            }
            error.value = validationError
            return null
        }

        error.value = null
        return { start, end }
    }

    const combinedDateTime = computed(() => {
        if (mode !== 'datetime') return null
        if (!selectedDate.value) return null
        if (!selectedTime.value) return selectedDate.value
        return combineDateTime(selectedDate.value, selectedTime.value)
    })

    const dateRange = computed<DateRange>(() => {
        if (mode !== 'range') return { start: null, end: null }
        return {
            start: startDate.value,
            end: endDate.value,
        }
    })

    const isValid = computed(() => {
        if (error.value) return false

        if (mode === 'range') {
            if (!startDate.value || !endDate.value) return false
            return isValidDate(startDate.value) && isValidDate(endDate.value)
        }

        if (!selectedDate.value) return false
        return isValidDate(selectedDate.value)
    })

    const formattedValue = computed(() => {
        if (mode === 'range') {
            return {
                start: startDate.value
                    ? formatDate(startDate.value, dateFormat.value, locale.value)
                    : null,
                end: endDate.value
                    ? formatDate(endDate.value, dateFormat.value, locale.value)
                    : null,
            } as FormattedRange
        }

        if (mode === 'datetime') {
            const dateTime = combinedDateTime.value
            if (!dateTime) return null
            return formatDate(dateTime, dateFormat.value, locale.value)
        }

        if (!selectedDate.value) return null
        return formatDate(selectedDate.value, dateFormat.value, locale.value)
    })

    const isoValue = computed(() => {
        if (mode === 'range') {
            return {
                start: startDate.value ? toISO(startDate.value) : null,
                end: endDate.value ? toISO(endDate.value) : null,
            } as ISORange
        }

        if (mode === 'datetime') {
            const dateTime = combinedDateTime.value
            if (!dateTime) return null
            return toISO(dateTime)
        }

        if (!selectedDate.value) return null
        return toISO(selectedDate.value)
    })

    const setDate = (date: Date | string | null) => {
        const parsed = parseDateInput(date)
        if (!parsed) {
            selectedDate.value = null
            error.value = null
            return
        }

        const validated = validateAndCorrectDate(parsed)
        if (validated) {
            selectedDate.value = validated
            if (mode === 'datetime' && !selectedTime.value) {
                selectedTime.value = extractTime(validated)
            }
        }
    }

    const setTime = (time: string | null) => {
        selectedTime.value = time
    }

    const setDateTime = (date: Date | string | null, time: string | null) => {
        setDate(date)
        setTime(time)
    }

    const setStartDate = (date: Date | string | null) => {
        const parsed = parseDateInput(date)
        const validated = validateAndCorrectRange(parsed, endDate.value)
        if (validated) {
            startDate.value = validated.start
        }
    }

    const setEndDate = (date: Date | string | null) => {
        const parsed = parseDateInput(date)
        const validated = validateAndCorrectRange(startDate.value, parsed)
        if (validated) {
            endDate.value = validated.end
        }
    }

    const setDateRangeFn = (start: Date | string | null, end: Date | string | null) => {
        const parsedStart = parseDateInput(start)
        const parsedEnd = parseDateInput(end)
        const validated = validateAndCorrectRange(parsedStart, parsedEnd)
        if (validated) {
            startDate.value = validated.start
            endDate.value = validated.end
        }
    }

    const setMinDate = (date: Date | null) => {
        minDate.value = date
        validate()
    }

    const setMaxDate = (date: Date | null) => {
        maxDate.value = date
        validate()
    }

    const setTimezone = (tz: string) => {
        timezone.value = tz
    }

    const setLocale = (loc: Locale) => {
        locale.value = loc
    }

    const setFormat = (fmt: string) => {
        dateFormat.value = fmt
    }

    const toUTCDate = (): Date | null => {
        if (mode === 'range') return null

        const dateToConvert = mode === 'datetime' ? combinedDateTime.value : selectedDate.value

        if (!dateToConvert) return null
        if (timezone.value === 'UTC' || timezone.value === 'local') {
            return dateToConvert
        }
        return toUTC(dateToConvert, timezone.value)
    }

    const toLocalDateFn = (): Date | null => {
        if (mode === 'range') return null

        const dateToConvert = mode === 'datetime' ? combinedDateTime.value : selectedDate.value

        if (!dateToConvert) return null
        if (timezone.value === 'local') return dateToConvert
        return toLocalDate(dateToConvert, timezone.value)
    }

    const validate = (): boolean => {
        if (mode === 'range') {
            const validationError = validateRange(
                startDate.value,
                endDate.value,
                minDate.value,
                maxDate.value
            )
            error.value = validationError
            return validationError === null
        }

        if (!selectedDate.value) return false
        const validationError = validateDateTime(
            selectedDate.value,
            minDate.value,
            maxDate.value
        )
        error.value = validationError
        return validationError === null
    }

    const reset = () => {
        selectedDate.value = null
        selectedTime.value = null
        startDate.value = null
        endDate.value = null
        error.value = null
    }

    const clear = () => {
        reset()
        minDate.value = null
        maxDate.value = null
    }

    const baseReturn = {
        formattedValue,
        isoValue,
        error: computed(() => error.value),
        isValid,
        minDate: computed(() => minDate.value),
        maxDate: computed(() => maxDate.value),
        format: computed(() => dateFormat.value),
        mode: computed(() => mode),
        setMinDate,
        setMaxDate,
        setLocale,
        setFormat,
        validate,
        reset,
        clear,
    }

    if (mode === 'range') {
        return {
            ...baseReturn,
            startDate: computed(() => startDate.value),
            endDate: computed(() => endDate.value),
            dateRange,
            setStartDate,
            setEndDate,
            setDateRange: setDateRangeFn,
        }
    }

    if (mode === 'datetime') {
        return {
            ...baseReturn,
            selectedDate: computed(() => selectedDate.value),
            selectedTime: computed(() => selectedTime.value),
            combinedDateTime,
            timezone: computed(() => timezone.value),
            setDate,
            setTime,
            setDateTime,
            setTimezone,
            toUTC: toUTCDate,
            toLocal: toLocalDateFn,
        }
    }

    return {
        ...baseReturn,
        selectedDate: computed(() => selectedDate.value),
        timezone: computed(() => timezone.value),
        setDate,
        setTimezone,
        toUTC: toUTCDate,
        toLocal: toLocalDateFn,
    }
}

export function defineDateTime(
    id: string,
    options: DateTimeOptions
): () => DateTimeReturn {
    return registerDateTime(id, () => createDateTime(options))
}
