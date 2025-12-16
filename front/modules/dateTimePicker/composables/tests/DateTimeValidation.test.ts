import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DateTimeValidation } from '../DateTimeValidation'
import { ref } from 'vue'

vi.mock('../../utils', () => ({
  isValidDate: vi.fn((date) => date instanceof Date && !isNaN(date.getTime())),
  validateDateTime: vi.fn((date) => (date === null ? 'required' : null)),
  validateRange: vi.fn((start, end) => (start && end ? null : 'invalid_range')),
  correctDate: vi.fn((date) => date)
}))

describe('DateTimeValidation', () => {
  let state: any
  let validation: DateTimeValidation

  beforeEach(() => {
    vi.clearAllMocks()
    state = {
      getMode: vi.fn(() => ref('single')),
      getError: vi.fn(() => ref(null)),
      getSelectedDate: vi.fn(() => ref(new Date())),
      getDateRange: vi.fn(() => ref({ start: null, end: null })),
      getMinDate: vi.fn(() => ref(null)),
      getMaxDate: vi.fn(() => ref(null)),
      getAutoCorrect: vi.fn(() => ref(false)),
      setError: vi.fn()
    }
    validation = new DateTimeValidation(state)
  })

  it('isValid returns true when single date is selected and no error', () => {
    const valid = validation.isValid().value
    expect(valid).toBe(true)
  })

  it('isValid returns false when range is incomplete', () => {
    state.getMode.mockReturnValue(ref('range'))
    state.getDateRange.mockReturnValue(ref({ start: new Date(), end: null }))
    
    const valid = validation.isValid().value
    expect(valid).toBe(false)
  })

  it('validate sets error state based on mode', () => {
    state.getSelectedDate.mockReturnValue(ref(null))
    
    const result = validation.validate()
    
    expect(state.setError).toHaveBeenCalledWith('required')
    expect(result).toBe(false)
  })

  it('validateAndCorrectDate handles invalid dates', () => {
    const result = validation.validateAndCorrectDate(new Date('invalid'))
    
    expect(state.setError).toHaveBeenCalledWith(expect.objectContaining({ type: 'invalid' }))
    expect(result).toBeNull()
  })

  it('validateAndCorrectDate returns corrected date when autoCorrect is true', () => {
    state.getAutoCorrect.mockReturnValue(ref(true))
    const testDate = new Date()
    
    const result = validation.validateAndCorrectDate(testDate)
    
    expect(state.setError).toHaveBeenCalledWith(null)
    expect(result).toEqual(testDate)
  })

  it('validateAndCorrectRange returns null if validation fails and autoCorrect is false', () => {
    state.getAutoCorrect.mockReturnValue(ref(false))
    
    const result = validation.validateAndCorrectRange(null, null)
    
    expect(state.setError).toHaveBeenCalledWith('invalid_range')
    expect(result).toBeNull()
  })

  it('validateAndCorrectRange returns range if autoCorrect is true', () => {
    state.getAutoCorrect.mockReturnValue(ref(true))
    const start = new Date()
    const end = new Date()
    
    const result = validation.validateAndCorrectRange(start, end)
    
    expect(state.setError).toHaveBeenCalledWith(null)
    expect(result).toEqual({ start, end })
  })
})
