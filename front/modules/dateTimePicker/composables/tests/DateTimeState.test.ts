import { describe, it, expect, beforeEach } from 'vitest'
import { DateTimeState } from '../DateTimeState'
import { isComputed } from 'vue'

describe('DateTimeState', () => {
  let state: DateTimeState

  beforeEach(() => {
    state = new DateTimeState()
  })

  it('initializes with default values', () => {
    expect(state.getMode().value).toBe('single')
    expect(state.getDateTimeMode().value).toBe('date')
    expect(state.getFormat().value).toBe('yyyy-MM-dd')
    expect(state.getTimezone().value).toBe('local')
    expect(state.getAutoCorrect().value).toBe(false)
  })

  it('initializes with provided options', () => {
    const minDate = new Date('2025-01-01')
    const customState = new DateTimeState({
      mode: 'range',
      dateTimeMode: 'datetime',
      format: 'dd/MM/yyyy',
      autoCorrect: true,
      minDate
    })

    expect(customState.getMode().value).toBe('range')
    expect(customState.getDateTimeMode().value).toBe('datetime')
    expect(customState.getFormat().value).toBe('dd/MM/yyyy')
    expect(customState.getAutoCorrect().value).toBe(true)
    expect(customState.getMinDate().value).toEqual(minDate)
  })

  it('sets minDate to now when defaultToNow is true', () => {
    const customState = new DateTimeState({ defaultToNow: true })
    expect(customState.getMinDate().value).toBeInstanceOf(Date)
  })

  it('updates selection state correctly', () => {
    const date = new Date()
    state.setSelectedDate(date)
    expect(state.getSelectedDate().value).toEqual(date)

    state.setSelectedTime('12:00')
    expect(state.getSelectedTime().value).toBe('12:00')

    const range = { start: new Date(), end: new Date() }
    state.setDateRange(range)
    expect(state.getDateRange().value).toEqual(range)
  })

  it('manages errors and configuration updates', () => {
    state.setError('invalid_date')
    expect(state.getError().value).toBe('invalid_date')

    state.setTimezone('UTC')
    expect(state.getTimezone().value).toBe('UTC')

    state.setFormat('HH:mm')
    expect(state.getFormat().value).toBe('HH:mm')
  })

  it('resets values but keeps constraints', () => {
    const minDate = new Date()
    state.setMinDate(minDate)
    state.setSelectedDate(new Date())
    state.setError('out_of_range')

    state.reset()

    expect(state.getSelectedDate().value).toBeNull()
    expect(state.getError().value).toBeNull()
    expect(state.getMinDate().value).toEqual(minDate)
  })

  it('clears everything including constraints', () => {
    state.setMinDate(new Date())
    state.setMaxDate(new Date())
    
    state.clear()

    expect(state.getMinDate().value).toBeNull()
    expect(state.getMaxDate().value).toBeNull()
    expect(state.getSelectedDate().value).toBeNull()
  })

  it('returns values as computed references', () => {
    expect(isComputed(state.getMode())).toBe(true)
    expect(isComputed(state.getSelectedDate())).toBe(true)
  })
})
