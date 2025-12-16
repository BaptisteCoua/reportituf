import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BaseDateTimePicker } from '../BaseDateTimePicker'

vi.mock('../core/DateTimeState', () => {
  return {
    DateTimeState: vi.fn().mockImplementation(() => ({
      getSelectedDate: vi.fn(),
      getSelectedTime: vi.fn(),
      getDateRange: vi.fn(),
      getMode: vi.fn(),
      getDateTimeMode: vi.fn(),
      getError: vi.fn(),
      setSelectedDate: vi.fn(),
      setSelectedTime: vi.fn(),
      setDateRange: vi.fn(),
      setMinDate: vi.fn(),
      setMaxDate: vi.fn(),
      setTimezone: vi.fn(),
      setLocale: vi.fn(),
      setFormat: vi.fn(),
      reset: vi.fn(),
      clear: vi.fn(),
      setError: vi.fn()
    }))
  }
})

vi.mock('../core/DateTimeValidation', () => {
  return {
    DateTimeValidation: vi.fn().mockImplementation(() => ({
      isValid: vi.fn(),
      validateAndCorrectDate: vi.fn((date) => date),
      validateAndCorrectRange: vi.fn((start, end) => ({ start, end })),
      validate: vi.fn()
    }))
  }
})

vi.mock('../core/DateTimeFormatting', () => {
  return {
    DateTimeFormatting: vi.fn().mockImplementation(() => ({
      getFormattedValue: vi.fn(),
      getISOValue: vi.fn(),
      parseAndSetDate: vi.fn((date) => (date ? new Date(date) : null)),
      toUTC: vi.fn(),
      toLocal: vi.fn()
    }))
  }
})

describe('BaseDateTimePicker', () => {
  let picker: BaseDateTimePicker

  beforeEach(() => {
    vi.clearAllMocks()
    picker = new BaseDateTimePicker()
  })

  it('initializes internal modules correctly', () => {
    expect(picker).toBeDefined()
  })

  it('delegates simple getters to state', () => {
    picker.getSelectedDate()
    expect(picker['state'].getSelectedDate).toHaveBeenCalled()
    
    picker.getError()
    expect(picker['state'].getError).toHaveBeenCalled()
  })

  it('delegates formatted values to formatting module', () => {
    picker.getFormattedValue()
    expect(picker['formatting'].getFormattedValue).toHaveBeenCalled()

    picker.getISOValue()
    expect(picker['formatting'].getISOValue).toHaveBeenCalled()
  })

  it('setDate parses and validates before setting', () => {
    const testDate = '2025-01-01'
    picker.setDate(testDate)
    
    expect(picker['formatting'].parseAndSetDate).toHaveBeenCalledWith(testDate)
    expect(picker['validation'].validateAndCorrectDate).toHaveBeenCalled()
    expect(picker['state'].setSelectedDate).toHaveBeenCalled()
  })

  it('setDate clears date and error if parsing fails', () => {
    vi.spyOn(picker['formatting'], 'parseAndSetDate').mockReturnValue(null)
    
    picker.setDate('invalid-date')
    
    expect(picker['state'].setSelectedDate).toHaveBeenCalledWith(null)
    expect(picker['state'].setError).toHaveBeenCalledWith(null)
  })

  it('setDateRange validates the range before setting state', () => {
    const start = '2025-01-01'
    const end = '2025-01-10'
    
    picker.setDateRange(start, end)
    
    expect(picker['formatting'].parseAndSetDate).toHaveBeenCalledTimes(2)
    expect(picker['validation'].validateAndCorrectRange).toHaveBeenCalled()
    expect(picker['state'].setDateRange).toHaveBeenCalled()
  })

  it('setMinDate and setMaxDate update state and trigger validation', () => {
    const date = new Date()
    
    picker.setMinDate(date)
    expect(picker['state'].setMinDate).toHaveBeenCalledWith(date)
    expect(picker['validation'].validate).toHaveBeenCalled()

    picker.setMaxDate(date)
    expect(picker['state'].setMaxDate).toHaveBeenCalledWith(date)
    expect(picker['validation'].validate).toHaveBeenCalled()
  })

  it('reset and clear call state methods', () => {
    picker.reset()
    expect(picker['state'].reset).toHaveBeenCalled()

    picker.clear()
    expect(picker['state'].clear).toHaveBeenCalled()
  })
})
