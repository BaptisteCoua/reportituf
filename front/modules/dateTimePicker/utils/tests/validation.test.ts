import { describe, it, expect } from 'vitest'
import { 
  isValidDate, 
  isDateInRange, 
  isRangeValid, 
  validateDateTime, 
  validateRange, 
  correctDate 
} from '../validation'

describe('Validation Utils', () => {
  const minDate = new Date(2025, 0, 1)
  const maxDate = new Date(2025, 0, 31)

  it('isValidDate validates date objects', () => {
    expect(isValidDate(new Date())).toBe(true)
    expect(isValidDate(new Date('invalid'))).toBe(false)
    expect(isValidDate(null)).toBe(false)
  })

  it('isDateInRange checks if date is between min and max', () => {
    const inside = new Date(2025, 0, 15)
    const before = new Date(2024, 11, 31)
    const after = new Date(2025, 1, 1)

    expect(isDateInRange(inside, minDate, maxDate)).toBe(true)
    expect(isDateInRange(before, minDate, maxDate)).toBe(false)
    expect(isDateInRange(after, minDate, maxDate)).toBe(false)
  })

  it('isRangeValid checks if start is before or equal to end', () => {
    const start = new Date(2025, 0, 1)
    const end = new Date(2025, 0, 10)

    expect(isRangeValid(start, end)).toBe(true)
    expect(isRangeValid(end, start)).toBe(false)
    expect(isRangeValid(start, start)).toBe(true)
    expect(isRangeValid(null, end)).toBe(true)
  })

  it('validateDateTime returns specific error types', () => {
    const before = new Date(2024, 11, 31)
    const after = new Date(2025, 1, 1)

    expect(validateDateTime(null)).toBeNull()
    expect(validateDateTime(new Date('invalid'))).toEqual(expect.objectContaining({ type: 'invalid' }))
    expect(validateDateTime(before, minDate)).toEqual(expect.objectContaining({ type: 'min' }))
    expect(validateDateTime(after, null, maxDate)).toEqual(expect.objectContaining({ type: 'max' }))
  })

  it('validateRange returns range error if dates are swapped', () => {
    const start = new Date(2025, 0, 10)
    const end = new Date(2025, 0, 1)

    const result = validateRange(start, end)
    expect(result).toEqual(expect.objectContaining({ type: 'range' }))
  })

  it('correctDate clamps date to boundaries', () => {
    const before = new Date(2024, 11, 31)
    const after = new Date(2025, 1, 1)

    expect(correctDate(before, minDate, maxDate)).toEqual(minDate)
    expect(correctDate(after, minDate, maxDate)).toEqual(maxDate)
    expect(correctDate(new Date(2025, 0, 15), minDate, maxDate)).toEqual(new Date(2025, 0, 15))
  })
})
