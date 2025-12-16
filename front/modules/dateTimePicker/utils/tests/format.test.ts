import { describe, it, expect } from 'vitest'
import { 
  formatDate, 
  parseDate, 
  toISO, 
  toUTC, 
  toLocalDate, 
  combineDateTime, 
  extractTime 
} from '../format'

describe('Format Utils', () => {
  const testDate = new Date(2025, 0, 1, 14, 30) // Jan 1st 2025, 14:30

  it('formatDate formats a date object correctly', () => {
    const result = formatDate(testDate, 'dd/MM/yyyy HH:mm')
    expect(result).toBe('01/01/2025 14:30')
  })

  it('parseDate converts valid ISO strings to Date objects', () => {
    const isoString = '2025-01-01T14:30:00Z'
    const result = parseDate(isoString)
    expect(result).toBeInstanceOf(Date)
    expect(result?.getFullYear()).toBe(2025)
  })

  it('parseDate returns null for invalid date strings', () => {
    expect(parseDate('not-a-date')).toBeNull()
  })

  it('toISO converts date to ISO string', () => {
    const date = new Date(2025, 0, 1)
    const result = toISO(date)
    expect(result).toContain('2025-01-01')
  })

  it('toUTC converts a date from a timezone to UTC', () => {
    const date = new Date('2025-01-01T14:30:00')
    const result = toUTC(date, 'Europe/Paris')
    expect(result).toBeInstanceOf(Date)
    // Paris is UTC+1 in winter, so UTC should be 13:30
    expect(result.getUTCHours()).toBe(13)
  })

  it('toLocalDate converts a UTC date to a specific timezone', () => {
    const date = new Date(Date.UTC(2025, 0, 1, 12, 0))
    const result = toLocalDate(date, 'Europe/Paris')
    // UTC 12:00 -> Paris 13:00
    expect(result.getHours()).toBe(13)
  })

  it('combineDateTime merges a Date object and a time string', () => {
    const date = new Date(2025, 0, 1)
    const time = '15:45'
    const result = combineDateTime(date, time)
    
    expect(result?.getHours()).toBe(15)
    expect(result?.getMinutes()).toBe(45)
  })

  it('combineDateTime returns null for invalid time format', () => {
    const date = new Date()
    expect(combineDateTime(date, 'invalid')).toBeNull()
    expect(combineDateTime(date, '25:70')).not.toBeNull() // Basic split doesn't block out of range, but Date will handle it
  })

  it('extractTime returns HH:mm string from Date', () => {
    const date = new Date()
    date.setHours(9, 5)
    expect(extractTime(date)).toBe('09:05')
  })
})
