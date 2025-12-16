import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DateTimeFormatting } from '../DateTimeFormatting'
import { ref } from 'vue'

vi.mock('../../utils', () => ({
  formatDate: vi.fn((date) => `formatted-${date.toISOString()}`),
  parseDate: vi.fn((str) => new Date(str)),
  toISO: vi.fn((date) => date.toISOString()),
  toUTC: vi.fn((date) => new Date(date.getTime() + 1000)),
  toLocalDate: vi.fn((date) => new Date(date.getTime() - 1000)),
  combineDateTime: vi.fn((date, time) => new Date(`${date.toISOString().split('T')[0]}T${time}`))
}))

describe('DateTimeFormatting', () => {
  let state: any
  let formatting: DateTimeFormatting
  const mockDate = new Date('2025-01-01T10:00:00Z')

  beforeEach(() => {
    vi.clearAllMocks()
    state = {
      getMode: vi.fn(() => ref('single')),
      getDateTimeMode: vi.fn(() => ref('date')),
      getFormat: vi.fn(() => ref('yyyy-MM-dd')),
      getLocale: vi.fn(() => ref({})),
      getSelectedDate: vi.fn(() => ref(mockDate)),
      getSelectedTime: vi.fn(() => ref('14:30')),
      getDateRange: vi.fn(() => ref({ start: null, end: null })),
      getTimezone: vi.fn(() => ref('UTC'))
    }
    formatting = new DateTimeFormatting(state)
  })

  it('getFormattedValue returns formatted date in single mode', () => {
    const result = formatting.getFormattedValue().value
    expect(result).toContain('formatted-')
  })

  it('getFormattedValue returns combined datetime when mode is datetime', () => {
    state.getDateTimeMode.mockReturnValue(ref('datetime'))
    const result = formatting.getFormattedValue().value
    expect(result).toBeDefined()
  })

  it('getFormattedValue returns a range object in range mode', () => {
    state.getMode.mockReturnValue(ref('range'))
    state.getDateRange.mockReturnValue(ref({ start: mockDate, end: mockDate }))
    
    const result = formatting.getFormattedValue().value as any
    expect(result).toHaveProperty('start')
    expect(result).toHaveProperty('end')
  })

  it('getISOValue returns ISO string in single mode', () => {
    const result = formatting.getISOValue().value
    expect(result).toBe(mockDate.toISOString())
  })

  it('parseAndSetDate handles strings and Date objects', () => {
    const dateStr = '2025-12-25'
    const result = formatting.parseAndSetDate(dateStr)
    expect(result).toBeInstanceOf(Date)

    const resultFromDate = formatting.parseAndSetDate(mockDate)
    expect(resultFromDate).toEqual(mockDate)

    expect(formatting.parseAndSetDate(null)).toBeNull()
  })

  it('toUTC converts date if timezone is not UTC', () => {
    state.getTimezone.mockReturnValue(ref('Europe/Paris'))
    const result = formatting.toUTC()
    expect(result).not.toEqual(mockDate)
  })

  it('toLocal converts date if timezone is not local', () => {
    state.getTimezone.mockReturnValue(ref('America/New_York'))
    const result = formatting.toLocal()
    expect(result).not.toEqual(mockDate)
  })
})
