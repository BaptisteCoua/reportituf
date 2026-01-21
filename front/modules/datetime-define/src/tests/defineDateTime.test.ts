import { describe, it, expect } from 'vitest'
import { defineDateTime } from '../defineDateTime'

describe('defineDateTime', () => {
    describe('mode: date', () => {
        it('cree une date avec les valeurs par defaut', () => {
            const useDate = defineDateTime<[]>(() => ({ mode: 'date' }))
            const dt = useDate()

            expect(dt.date.value).toBeNull()
            expect(dt.minDate.value).toBeNull()
            expect(dt.maxDate.value).toBeNull()
            expect(dt.isValid.value).toBe(false)
        })

        it('setDate definit la date', () => {
            const useDate = defineDateTime<[]>(() => ({ mode: 'date' }))
            const dt = useDate()

            dt.setDate(new Date('2024-06-15'))

            expect(dt.date.value).toEqual(new Date('2024-06-15'))
            expect(dt.isValid.value).toBe(true)
        })

        it('valide avec minDate', () => {
            const useDate = defineDateTime<[]>(() => ({
                mode: 'date',
                minDate: new Date('2024-01-01'),
            }))
            const dt = useDate()

            dt.setDate(new Date('2023-12-15'))
            expect(dt.isValid.value).toBe(false)

            dt.setDate(new Date('2024-06-15'))
            expect(dt.isValid.value).toBe(true)
        })

        it('valide avec maxDate', () => {
            const useDate = defineDateTime<[]>(() => ({
                mode: 'date',
                maxDate: new Date('2024-12-31'),
            }))
            const dt = useDate()

            dt.setDate(new Date('2025-01-15'))
            expect(dt.isValid.value).toBe(false)

            dt.setDate(new Date('2024-06-15'))
            expect(dt.isValid.value).toBe(true)
        })

        it('setMinDate et setMaxDate modifient les limites', () => {
            const useDate = defineDateTime<[]>(() => ({ mode: 'date' }))
            const dt = useDate()

            dt.setDate(new Date('2024-06-15'))
            expect(dt.isValid.value).toBe(true)

            dt.setMinDate(new Date('2024-07-01'))
            expect(dt.isValid.value).toBe(false)

            dt.setMinDate(null)
            dt.setMaxDate(new Date('2024-05-01'))
            expect(dt.isValid.value).toBe(false)
        })

        it('reset reinitialise la date', () => {
            const useDate = defineDateTime<[]>(() => ({ mode: 'date' }))
            const dt = useDate()

            dt.setDate(new Date('2024-06-15'))
            dt.reset()

            expect(dt.date.value).toBeNull()
        })

        it('passe les arguments a la config', () => {
            const useDate = defineDateTime<[Date]>(minDate => ({
                mode: 'date',
                minDate,
            }))
            const dt = useDate(new Date('2024-01-01'))

            dt.setDate(new Date('2023-12-15'))
            expect(dt.isValid.value).toBe(false)
        })
    })

    describe('mode: datetime', () => {
        it('cree un datetime avec les valeurs par defaut', () => {
            const useDt = defineDateTime<[]>(() => ({ mode: 'datetime' }))
            const dt = useDt()

            expect(dt.date.value).toBeNull()
            expect(dt.time.value).toBeNull()
            expect(dt.combined.value).toBeNull()
            expect(dt.isValid.value).toBe(false)
        })

        it('setDate et setTime definissent les valeurs', () => {
            const useDt = defineDateTime<[]>(() => ({ mode: 'datetime' }))
            const dt = useDt()

            dt.setDate(new Date('2024-06-15'))
            dt.setTime('14:30')

            expect(dt.date.value).toEqual(new Date('2024-06-15'))
            expect(dt.time.value).toBe('14:30')
        })

        it('setDateTime definit les deux valeurs', () => {
            const useDt = defineDateTime<[]>(() => ({ mode: 'datetime' }))
            const dt = useDt()

            dt.setDateTime(new Date('2024-06-15'), '14:30')

            expect(dt.date.value).toEqual(new Date('2024-06-15'))
            expect(dt.time.value).toBe('14:30')
        })

        it('combined combine date et temps', () => {
            const useDt = defineDateTime<[]>(() => ({ mode: 'datetime' }))
            const dt = useDt()

            dt.setDateTime(new Date('2024-06-15'), '14:30')

            expect(dt.combined.value?.getHours()).toBe(14)
            expect(dt.combined.value?.getMinutes()).toBe(30)
        })

        it('combined retourne la date seule si pas de temps', () => {
            const useDt = defineDateTime<[]>(() => ({ mode: 'datetime' }))
            const dt = useDt()

            dt.setDate(new Date('2024-06-15'))

            expect(dt.combined.value).toEqual(new Date('2024-06-15'))
        })

        it('valide le combined avec min/max', () => {
            const useDt = defineDateTime<[]>(() => ({
                mode: 'datetime',
                minDate: new Date('2024-06-15T10:00:00'),
            }))
            const dt = useDt()

            dt.setDateTime(new Date('2024-06-15'), '09:00')
            expect(dt.isValid.value).toBe(false)

            dt.setTime('11:00')
            expect(dt.isValid.value).toBe(true)
        })

        it('reset reinitialise date et temps', () => {
            const useDt = defineDateTime<[]>(() => ({ mode: 'datetime' }))
            const dt = useDt()

            dt.setDateTime(new Date('2024-06-15'), '14:30')
            dt.reset()

            expect(dt.date.value).toBeNull()
            expect(dt.time.value).toBeNull()
        })
    })

    describe('mode: range', () => {
        it('cree une range avec les valeurs par defaut', () => {
            const useRange = defineDateTime<[]>(() => ({ mode: 'range' }))
            const dt = useRange()

            expect(dt.start.value).toBeNull()
            expect(dt.end.value).toBeNull()
            expect(dt.isValid.value).toBe(false)
        })

        it('setStart et setEnd definissent les valeurs', () => {
            const useRange = defineDateTime<[]>(() => ({ mode: 'range' }))
            const dt = useRange()

            dt.setStart(new Date('2024-06-01'))
            dt.setEnd(new Date('2024-06-30'))

            expect(dt.start.value).toEqual(new Date('2024-06-01'))
            expect(dt.end.value).toEqual(new Date('2024-06-30'))
            expect(dt.isValid.value).toBe(true)
        })

        it('setRange definit les deux valeurs', () => {
            const useRange = defineDateTime<[]>(() => ({ mode: 'range' }))
            const dt = useRange()

            dt.setRange(new Date('2024-06-01'), new Date('2024-06-30'))

            expect(dt.start.value).toEqual(new Date('2024-06-01'))
            expect(dt.end.value).toEqual(new Date('2024-06-30'))
        })

        it('invalide si une seule date', () => {
            const useRange = defineDateTime<[]>(() => ({ mode: 'range' }))
            const dt = useRange()

            dt.setStart(new Date('2024-06-01'))
            expect(dt.isValid.value).toBe(false)
        })

        it('invalide si start apres end', () => {
            const useRange = defineDateTime<[]>(() => ({ mode: 'range' }))
            const dt = useRange()

            dt.setRange(new Date('2024-06-30'), new Date('2024-06-01'))
            expect(dt.isValid.value).toBe(false)
        })

        it('valide avec min/max', () => {
            const useRange = defineDateTime<[]>(() => ({
                mode: 'range',
                minDate: new Date('2024-01-01'),
                maxDate: new Date('2024-12-31'),
            }))
            const dt = useRange()

            dt.setRange(new Date('2023-12-01'), new Date('2024-06-30'))
            expect(dt.isValid.value).toBe(false)

            dt.setRange(new Date('2024-06-01'), new Date('2025-01-15'))
            expect(dt.isValid.value).toBe(false)

            dt.setRange(new Date('2024-06-01'), new Date('2024-06-30'))
            expect(dt.isValid.value).toBe(true)
        })

        it('reset reinitialise la range', () => {
            const useRange = defineDateTime<[]>(() => ({ mode: 'range' }))
            const dt = useRange()

            dt.setRange(new Date('2024-06-01'), new Date('2024-06-30'))
            dt.reset()

            expect(dt.start.value).toBeNull()
            expect(dt.end.value).toBeNull()
        })
    })
})
