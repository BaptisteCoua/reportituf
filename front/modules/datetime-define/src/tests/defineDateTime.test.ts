import { describe, it, expect, beforeEach } from 'vitest'
import { defineDateTime } from '../defineDateTime'
import { clearDateTimeRegistry } from '../store/registry'

describe('defineDateTime', () => {
    beforeEach(() => {
        clearDateTimeRegistry()
    })

    describe('mode: date', () => {
        it('cree une date avec les options par defaut', () => {
            const useBirthDate = defineDateTime('birthDate', { mode: 'date' })
            const date = useBirthDate()

            expect(date.selectedDate?.value).toBeNull()
            expect(date.format.value).toBe('yyyy-MM-dd')
            expect(date.timezone?.value).toBe('local')
        })

        it('cree une date avec une valeur initiale', () => {
            const initialDate = new Date('2024-06-15')
            const useEventDate = defineDateTime('eventDate', {
                mode: 'date',
                initialDate,
            })
            const date = useEventDate()

            expect(date.selectedDate?.value).toEqual(initialDate)
        })

        it('retourne la meme instance pour le meme id', () => {
            const useDate1 = defineDateTime('sameId', { mode: 'date' })
            const useDate2 = defineDateTime('sameId', { mode: 'date' })

            const date1 = useDate1()
            const date2 = useDate2()

            date1.setDate?.(new Date('2024-01-15'))

            expect(date2.selectedDate?.value).toEqual(new Date('2024-01-15'))
        })

        describe('setDate', () => {
            it('definit une date valide', () => {
                const useDate = defineDateTime('setDateTest', { mode: 'date' })
                const date = useDate()

                date.setDate?.(new Date('2024-06-15'))

                expect(date.selectedDate?.value).toEqual(new Date('2024-06-15'))
                expect(date.isValid.value).toBe(true)
            })

            it('parse une date string', () => {
                const useDate = defineDateTime('parseTest', { mode: 'date' })
                const date = useDate()

                date.setDate?.('2024-06-15')

                expect(date.selectedDate?.value).not.toBeNull()
                expect(date.isValid.value).toBe(true)
            })

            it('setDate null reinitialise', () => {
                const useDate = defineDateTime('nullTest', { mode: 'date' })
                const date = useDate()

                date.setDate?.(new Date('2024-06-15'))
                date.setDate?.(null)

                expect(date.selectedDate?.value).toBeNull()
            })
        })

        describe('validation', () => {
            it('valide une date dans les limites', () => {
                const useDate = defineDateTime('validTest', {
                    mode: 'date',
                    minDate: new Date('2024-01-01'),
                    maxDate: new Date('2024-12-31'),
                })
                const date = useDate()

                date.setDate?.(new Date('2024-06-15'))

                expect(date.isValid.value).toBe(true)
                expect(date.error.value).toBeNull()
            })

            it('erreur si date avant minDate', () => {
                const useDate = defineDateTime('minTest', {
                    mode: 'date',
                    minDate: new Date('2024-01-01'),
                })
                const date = useDate()

                date.setDate?.(new Date('2023-12-15'))

                expect(date.error.value?.type).toBe('min')
            })

            it('erreur si date apres maxDate', () => {
                const useDate = defineDateTime('maxTest', {
                    mode: 'date',
                    maxDate: new Date('2024-12-31'),
                })
                const date = useDate()

                date.setDate?.(new Date('2025-01-15'))

                expect(date.error.value?.type).toBe('max')
            })

            it('autoCorrect corrige la date', () => {
                const minDate = new Date('2024-01-01')
                const useDate = defineDateTime('autoCorrectTest', {
                    mode: 'date',
                    minDate,
                    autoCorrect: true,
                })
                const date = useDate()

                date.setDate?.(new Date('2023-12-15'))

                expect(date.selectedDate?.value).toEqual(minDate)
                expect(date.error.value).toBeNull()
            })
        })

        describe('formattedValue', () => {
            it('retourne null si pas de date', () => {
                const useDate = defineDateTime('formatNullTest', { mode: 'date' })
                const date = useDate()

                expect(date.formattedValue.value).toBeNull()
            })

            it('formate avec le format par defaut', () => {
                const useDate = defineDateTime('formatDefaultTest', { mode: 'date' })
                const date = useDate()

                date.setDate?.(new Date('2024-06-15'))

                expect(date.formattedValue.value).toBe('2024-06-15')
            })

            it('formate avec un format custom', () => {
                const useDate = defineDateTime('formatCustomTest', {
                    mode: 'date',
                    format: 'dd/MM/yyyy',
                })
                const date = useDate()

                date.setDate?.(new Date('2024-06-15'))

                expect(date.formattedValue.value).toBe('15/06/2024')
            })
        })

        describe('isoValue', () => {
            it('retourne null si pas de date', () => {
                const useDate = defineDateTime('isoNullTest', { mode: 'date' })
                const date = useDate()

                expect(date.isoValue.value).toBeNull()
            })

            it('retourne la valeur ISO', () => {
                const useDate = defineDateTime('isoTest', { mode: 'date' })
                const date = useDate()

                date.setDate?.(new Date('2024-06-15'))

                expect(date.isoValue.value).toContain('2024-06-15')
            })
        })

        describe('reset et clear', () => {
            it('reset reinitialise la date', () => {
                const useDate = defineDateTime('resetTest', { mode: 'date' })
                const date = useDate()

                date.setDate?.(new Date('2024-06-15'))
                date.reset()

                expect(date.selectedDate?.value).toBeNull()
                expect(date.error.value).toBeNull()
            })

            it('clear reinitialise tout', () => {
                const useDate = defineDateTime('clearTest', {
                    mode: 'date',
                    minDate: new Date('2024-01-01'),
                    maxDate: new Date('2024-12-31'),
                })
                const date = useDate()

                date.setDate?.(new Date('2024-06-15'))
                date.clear()

                expect(date.selectedDate?.value).toBeNull()
                expect(date.minDate.value).toBeNull()
                expect(date.maxDate.value).toBeNull()
            })
        })

        describe('setMinDate et setMaxDate', () => {
            it('setMinDate met a jour et revalide', () => {
                const useDate = defineDateTime('setMinTest', { mode: 'date' })
                const date = useDate()

                date.setDate?.(new Date('2024-06-15'))
                date.setMinDate(new Date('2024-07-01'))

                expect(date.error.value?.type).toBe('min')
            })

            it('setMaxDate met a jour et revalide', () => {
                const useDate = defineDateTime('setMaxTest', { mode: 'date' })
                const date = useDate()

                date.setDate?.(new Date('2024-06-15'))
                date.setMaxDate(new Date('2024-05-01'))

                expect(date.error.value?.type).toBe('max')
            })
        })
    })

    describe('mode: datetime', () => {
        it('cree un datetime avec les options par defaut', () => {
            const useEventDateTime = defineDateTime('eventDateTime', {
                mode: 'datetime',
            })
            const dt = useEventDateTime()

            expect(dt.selectedDate?.value).toBeNull()
            expect(dt.selectedTime?.value).toBeNull()
            expect(dt.format.value).toBe('yyyy-MM-dd HH:mm')
        })

        it('cree un datetime avec des valeurs initiales', () => {
            const initialDate = new Date('2024-06-15')
            const useMeetingTime = defineDateTime('meetingTime', {
                mode: 'datetime',
                initialDate,
                initialTime: '14:30',
            })
            const dt = useMeetingTime()

            expect(dt.selectedDate?.value).toEqual(initialDate)
            expect(dt.selectedTime?.value).toBe('14:30')
        })

        describe('setDate', () => {
            it('definit une date et extrait le temps', () => {
                const useDt = defineDateTime('setDateTest', { mode: 'datetime' })
                const dt = useDt()

                dt.setDate?.(new Date('2024-06-15T10:30:00'))

                expect(dt.selectedDate?.value).not.toBeNull()
                expect(dt.selectedTime?.value).toBe('10:30')
            })
        })

        describe('setTime', () => {
            it('definit le temps', () => {
                const useDt = defineDateTime('setTimeTest', { mode: 'datetime' })
                const dt = useDt()

                dt.setDate?.(new Date('2024-06-15'))
                dt.setTime?.('15:45')

                expect(dt.selectedTime?.value).toBe('15:45')
            })
        })

        describe('setDateTime', () => {
            it('definit date et temps ensemble', () => {
                const useDt = defineDateTime('setDateTimeTest', { mode: 'datetime' })
                const dt = useDt()

                dt.setDateTime?.(new Date('2024-06-15'), '16:00')

                expect(dt.selectedDate?.value).not.toBeNull()
                expect(dt.selectedTime?.value).toBe('16:00')
            })
        })

        describe('combinedDateTime', () => {
            it('combine date et temps', () => {
                const useDt = defineDateTime('combinedTest', { mode: 'datetime' })
                const dt = useDt()

                dt.setDate?.(new Date('2024-06-15'))
                dt.setTime?.('14:30')

                const combined = dt.combinedDateTime?.value
                expect(combined?.getHours()).toBe(14)
                expect(combined?.getMinutes()).toBe(30)
            })

            it('retourne la date seule si pas de temps', () => {
                const useDt = defineDateTime('noCombinedTest', { mode: 'datetime' })
                const dt = useDt()

                dt.setDate?.(new Date('2024-06-15'))

                expect(dt.combinedDateTime?.value).not.toBeNull()
            })
        })

        describe('formattedValue', () => {
            it('formate date et temps', () => {
                const useDt = defineDateTime('formatTest', {
                    mode: 'datetime',
                    format: 'dd/MM/yyyy HH:mm',
                })
                const dt = useDt()

                dt.setDate?.(new Date('2024-06-15'))
                dt.setTime?.('14:30')

                expect(dt.formattedValue.value).toBe('15/06/2024 14:30')
            })
        })

        describe('validation', () => {
            it('valide dans les limites', () => {
                const useDt = defineDateTime('validTest', {
                    mode: 'datetime',
                    minDate: new Date('2024-01-01'),
                    maxDate: new Date('2024-12-31'),
                })
                const dt = useDt()

                dt.setDate?.(new Date('2024-06-15'))

                expect(dt.isValid.value).toBe(true)
            })

            it('erreur si hors limites', () => {
                const useDt = defineDateTime('invalidTest', {
                    mode: 'datetime',
                    minDate: new Date('2024-01-01'),
                })
                const dt = useDt()

                dt.setDate?.(new Date('2023-12-15'))

                expect(dt.error.value?.type).toBe('min')
            })

            it('autoCorrect corrige la date', () => {
                const minDate = new Date('2024-01-01')
                const useDt = defineDateTime('autoCorrectTest', {
                    mode: 'datetime',
                    minDate,
                    autoCorrect: true,
                })
                const dt = useDt()

                dt.setDate?.(new Date('2023-12-15'))

                expect(dt.selectedDate?.value).toEqual(minDate)
            })
        })

        describe('reset et clear', () => {
            it('reset reinitialise date et temps', () => {
                const useDt = defineDateTime('resetTest', { mode: 'datetime' })
                const dt = useDt()

                dt.setDateTime?.(new Date('2024-06-15'), '14:30')
                dt.reset()

                expect(dt.selectedDate?.value).toBeNull()
                expect(dt.selectedTime?.value).toBeNull()
            })

            it('clear reinitialise tout', () => {
                const useDt = defineDateTime('clearTest', {
                    mode: 'datetime',
                    minDate: new Date('2024-01-01'),
                })
                const dt = useDt()

                dt.setDate?.(new Date('2024-06-15'))
                dt.clear()

                expect(dt.selectedDate?.value).toBeNull()
                expect(dt.minDate.value).toBeNull()
            })
        })
    })

    describe('mode: range', () => {
        it('cree une plage avec les options par defaut', () => {
            const useBookingRange = defineDateTime('bookingRange', {
                mode: 'range',
            })
            const range = useBookingRange()

            expect(range.startDate?.value).toBeNull()
            expect(range.endDate?.value).toBeNull()
            expect(range.format.value).toBe('yyyy-MM-dd')
        })

        it('cree une plage avec des valeurs initiales', () => {
            const start = new Date('2024-01-01')
            const end = new Date('2024-01-31')
            const useVacationRange = defineDateTime('vacationRange', {
                mode: 'range',
                initialRange: { start, end },
            })
            const range = useVacationRange()

            expect(range.startDate?.value).toEqual(start)
            expect(range.endDate?.value).toEqual(end)
        })

        describe('setStartDate', () => {
            it('definit la date de debut', () => {
                const useRange = defineDateTime('startTest', { mode: 'range' })
                const range = useRange()

                range.setStartDate?.(new Date('2024-06-01'))

                expect(range.startDate?.value).toEqual(new Date('2024-06-01'))
            })
        })

        describe('setEndDate', () => {
            it('definit la date de fin', () => {
                const useRange = defineDateTime('endTest', { mode: 'range' })
                const range = useRange()

                range.setEndDate?.(new Date('2024-06-30'))

                expect(range.endDate?.value).toEqual(new Date('2024-06-30'))
            })
        })

        describe('setDateRange', () => {
            it('definit les deux dates', () => {
                const useRange = defineDateTime('bothTest', { mode: 'range' })
                const range = useRange()

                range.setDateRange?.(new Date('2024-06-01'), new Date('2024-06-30'))

                expect(range.startDate?.value).toEqual(new Date('2024-06-01'))
                expect(range.endDate?.value).toEqual(new Date('2024-06-30'))
            })

            it('parse des strings', () => {
                const useRange = defineDateTime('parseTest', { mode: 'range' })
                const range = useRange()

                range.setDateRange?.('2024-06-01', '2024-06-30')

                expect(range.startDate?.value).not.toBeNull()
                expect(range.endDate?.value).not.toBeNull()
            })
        })

        describe('dateRange', () => {
            it('retourne un objet avec start et end', () => {
                const useRange = defineDateTime('rangeObjectTest', {
                    mode: 'range',
                })
                const range = useRange()

                range.setDateRange?.(new Date('2024-06-01'), new Date('2024-06-30'))

                expect(range.dateRange?.value.start).toEqual(new Date('2024-06-01'))
                expect(range.dateRange?.value.end).toEqual(new Date('2024-06-30'))
            })
        })

        describe('isValid', () => {
            it('valide si les deux dates sont presentes et correctes', () => {
                const useRange = defineDateTime('validTest', { mode: 'range' })
                const range = useRange()

                range.setDateRange?.(new Date('2024-06-01'), new Date('2024-06-30'))

                expect(range.isValid.value).toBe(true)
            })

            it('invalide si une seule date', () => {
                const useRange = defineDateTime('invalidSingleTest', {
                    mode: 'range',
                })
                const range = useRange()

                range.setStartDate?.(new Date('2024-06-01'))

                expect(range.isValid.value).toBe(false)
            })

            it('erreur si start apres end', () => {
                const useRange = defineDateTime('rangeErrorTest', { mode: 'range' })
                const range = useRange()

                range.setDateRange?.(new Date('2024-06-30'), new Date('2024-06-01'))

                expect(range.error.value?.type).toBe('range')
            })
        })

        describe('validation avec min/max', () => {
            it('valide dans les limites', () => {
                const useRange = defineDateTime('limitsValidTest', {
                    mode: 'range',
                    minDate: new Date('2024-01-01'),
                    maxDate: new Date('2024-12-31'),
                })
                const range = useRange()

                range.setDateRange?.(new Date('2024-06-01'), new Date('2024-06-30'))

                expect(range.isValid.value).toBe(true)
            })

            it('erreur si start avant minDate', () => {
                const useRange = defineDateTime('minErrorTest', {
                    mode: 'range',
                    minDate: new Date('2024-01-01'),
                })
                const range = useRange()

                range.setStartDate?.(new Date('2023-12-15'))

                expect(range.error.value?.type).toBe('min')
            })

            it('erreur si end apres maxDate', () => {
                const useRange = defineDateTime('maxErrorTest', {
                    mode: 'range',
                    maxDate: new Date('2024-12-31'),
                })
                const range = useRange()

                range.setEndDate?.(new Date('2025-01-15'))

                expect(range.error.value?.type).toBe('max')
            })

            it('autoCorrect corrige les dates', () => {
                const minDate = new Date('2024-01-01')
                const maxDate = new Date('2024-12-31')
                const useRange = defineDateTime('autoCorrectTest', {
                    mode: 'range',
                    minDate,
                    maxDate,
                    autoCorrect: true,
                })
                const range = useRange()

                range.setDateRange?.(
                    new Date('2023-12-01'),
                    new Date('2025-02-01')
                )

                expect(range.startDate?.value).toEqual(minDate)
                expect(range.endDate?.value).toEqual(maxDate)
            })
        })

        describe('formattedValue', () => {
            it('formate les deux dates', () => {
                const useRange = defineDateTime('formatTest', {
                    mode: 'range',
                    format: 'dd/MM/yyyy',
                })
                const range = useRange()

                range.setDateRange?.(new Date('2024-06-01'), new Date('2024-06-30'))

                const formatted = range.formattedValue.value
                if (formatted && typeof formatted === 'object') {
                    expect(formatted.start).toBe('01/06/2024')
                    expect(formatted.end).toBe('30/06/2024')
                }
            })
        })

        describe('isoValue', () => {
            it('retourne les valeurs ISO', () => {
                const useRange = defineDateTime('isoTest', { mode: 'range' })
                const range = useRange()

                range.setDateRange?.(new Date('2024-06-01'), new Date('2024-06-30'))

                const iso = range.isoValue.value
                if (iso && typeof iso === 'object') {
                    expect(iso.start).toContain('2024-06-01')
                    expect(iso.end).toContain('2024-06-30')
                }
            })
        })

        describe('reset et clear', () => {
            it('reset reinitialise les dates', () => {
                const useRange = defineDateTime('resetTest', { mode: 'range' })
                const range = useRange()

                range.setDateRange?.(new Date('2024-06-01'), new Date('2024-06-30'))
                range.reset()

                expect(range.startDate?.value).toBeNull()
                expect(range.endDate?.value).toBeNull()
            })

            it('clear reinitialise tout', () => {
                const useRange = defineDateTime('clearTest', {
                    mode: 'range',
                    minDate: new Date('2024-01-01'),
                })
                const range = useRange()

                range.setDateRange?.(new Date('2024-06-01'), new Date('2024-06-30'))
                range.clear()

                expect(range.startDate?.value).toBeNull()
                expect(range.minDate.value).toBeNull()
            })
        })
    })
})
