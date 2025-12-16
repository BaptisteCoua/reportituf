import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDateTimePicker } from '../index'
import { BaseDateTimePicker } from '../BaseDateTimePicker'

vi.mock('../BaseDateTimePicker', () => {
  return {
    BaseDateTimePicker: vi.fn().mockImplementation(() => ({
      getSelectedDate: vi.fn(() => '2025-01-01'),
      getSelectedTime: vi.fn(() => '12:00'),
      getDateRange: vi.fn(() => ({ start: null, end: null })),
      getMode: vi.fn(() => 'single'),
      getDateTimeMode: vi.fn(() => 'date'),
      getError: vi.fn(() => null),
      isValid: vi.fn(() => true),
      getFormattedValue: vi.fn(() => 'formatted'),
      getISOValue: vi.fn(() => 'iso'),
      setDate: vi.fn(),
      setTime: vi.fn(),
      setDateRange: vi.fn(),
      setMinDate: vi.fn(),
      setMaxDate: vi.fn(),
      setTimezone: vi.fn(),
      setLocale: vi.fn(),
      setFormat: vi.fn(),
      toUTC: vi.fn(),
      toLocal: vi.fn(),
      validate: vi.fn(),
      reset: vi.fn(),
      clear: vi.fn(),
    }))
  }
})

describe('useDateTimePicker Composable', () => {
  it('should initialize BaseDateTimePicker with provided options', () => {
    const options = { mode: 'range' as const }
    useDateTimePicker(options)
    expect(BaseDateTimePicker).toHaveBeenCalledWith(options)
  })

  it('should return all picker properties and methods', () => {
    const picker = useDateTimePicker()
    
    expect(picker.selectedDate).toBe('2025-01-01')
    expect(picker.formattedValue).toBe('formatted')
    expect(picker.isValid).toBe(true)
    expect(typeof picker.setDate).toBe('function')
    expect(typeof picker.reset).toBe('function')
  })

  it('should maintain correct context for methods using bind', () => {
    const picker = useDateTimePicker()
    const mockDate = new Date()
    
    picker.setDate(mockDate)
    
    const instance = vi.mocked(BaseDateTimePicker).mock.results[0].value
    expect(instance.setDate).toHaveBeenCalledWith(mockDate)
  })
})
