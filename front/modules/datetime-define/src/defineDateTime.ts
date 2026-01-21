import { ref, computed, type Ref, type ComputedRef } from 'vue'

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

export function defineDateTime<TArgs extends unknown[]>(
    callback: (...args: TArgs) => DateConfig
): (...args: TArgs) => DateReturn

export function defineDateTime<TArgs extends unknown[]>(
    callback: (...args: TArgs) => DateTimeConfig
): (...args: TArgs) => DateTimeReturn

export function defineDateTime<TArgs extends unknown[]>(
    callback: (...args: TArgs) => RangeConfig
): (...args: TArgs) => RangeReturn

export function defineDateTime<TArgs extends unknown[]>(
    callback: (...args: TArgs) => DateConfig | DateTimeConfig | RangeConfig
) {
    return (...args: TArgs) => {
        const config = callback(...args)

        const minDate = ref<Date | null>(config.minDate ?? null)
        const maxDate = ref<Date | null>(config.maxDate ?? null)

        const setMinDate = (value: Date | null) => {
            minDate.value = value
        }

        const setMaxDate = (value: Date | null) => {
            maxDate.value = value
        }

        if (config.mode === 'date') {
            const date = ref<Date | null>(null)

            const isValid = computed(() => {
                if (!date.value) return false
                if (minDate.value && date.value < minDate.value) return false
                if (maxDate.value && date.value > maxDate.value) return false
                return true
            })

            const setDate = (value: Date | null) => {
                date.value = value
            }

            const reset = () => {
                date.value = null
            }

            return { date, minDate, maxDate, isValid, setDate, setMinDate, setMaxDate, reset }
        }

        if (config.mode === 'datetime') {
            const date = ref<Date | null>(null)
            const time = ref<string | null>(null)

            const combined = computed(() => {
                if (!date.value) return null
                if (!time.value) return date.value

                const [hours, minutes] = time.value.split(':').map(Number)
                if (isNaN(hours) || isNaN(minutes)) return date.value

                const result = new Date(date.value)
                result.setHours(hours, minutes, 0, 0)
                return result
            })

            const isValid = computed(() => {
                if (!combined.value) return false
                if (minDate.value && combined.value < minDate.value) return false
                if (maxDate.value && combined.value > maxDate.value) return false
                return true
            })

            const setDate = (value: Date | null) => {
                date.value = value
            }

            const setTime = (value: string | null) => {
                time.value = value
            }

            const setDateTime = (d: Date | null, t: string | null) => {
                date.value = d
                time.value = t
            }

            const reset = () => {
                date.value = null
                time.value = null
            }

            return {
                date,
                time,
                combined,
                minDate,
                maxDate,
                isValid,
                setDate,
                setTime,
                setDateTime,
                setMinDate,
                setMaxDate,
                reset,
            }
        }

        const start = ref<Date | null>(null)
        const end = ref<Date | null>(null)

        const isValid = computed(() => {
            if (!start.value || !end.value) return false
            if (start.value > end.value) return false
            if (minDate.value && start.value < minDate.value) return false
            if (maxDate.value && end.value > maxDate.value) return false
            return true
        })

        const setStart = (value: Date | null) => {
            start.value = value
        }

        const setEnd = (value: Date | null) => {
            end.value = value
        }

        const setRange = (s: Date | null, e: Date | null) => {
            start.value = s
            end.value = e
        }

        const reset = () => {
            start.value = null
            end.value = null
        }

        return {
            start,
            end,
            minDate,
            maxDate,
            isValid,
            setStart,
            setEnd,
            setRange,
            setMinDate,
            setMaxDate,
            reset,
        }
    }
}
