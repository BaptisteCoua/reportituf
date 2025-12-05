import type { DateTimePickerOptions } from '../types'
import { DateTimeState } from './DateTimeState'
import { DateTimeValidation } from './DateTimeValidation'
import { DateTimeFormatting } from './DateTimeFormatting'
import type { Locale } from 'date-fns'

export class BaseDateTimePicker {
  protected state: DateTimeState
  protected validation: DateTimeValidation
  protected formatting: DateTimeFormatting

  constructor(options: DateTimePickerOptions = {}) {
    this.state = new DateTimeState(options)
    this.validation = new DateTimeValidation(this.state)
    this.formatting = new DateTimeFormatting(this.state)
  }

  getSelectedDate() {
    return this.state.getSelectedDate()
  }

  getSelectedTime() {
    return this.state.getSelectedTime()
  }

  getDateRange() {
    return this.state.getDateRange()
  }

  getMode() {
    return this.state.getMode()
  }

  getDateTimeMode() {
    return this.state.getDateTimeMode()
  }

  getError() {
    return this.state.getError()
  }

  isValid() {
    return this.validation.isValid()
  }

  getFormattedValue() {
    return this.formatting.getFormattedValue()
  }

  getISOValue() {
    return this.formatting.getISOValue()
  }

  setDate(date: Date | string | null) {
    const parsedDate = this.formatting.parseAndSetDate(date)
    if (!parsedDate) {
      this.state.setSelectedDate(null)
      this.state.setError(null)
      return
    }
    
    const validatedDate = this.validation.validateAndCorrectDate(parsedDate)
    if (validatedDate) {
      this.state.setSelectedDate(validatedDate)
    }
  }

  setTime(time: string | null) {
    this.state.setSelectedTime(time)
  }

  setDateRange(start: Date | string | null, end: Date | string | null) {
    const parsedStart = this.formatting.parseAndSetDate(start)
    const parsedEnd = this.formatting.parseAndSetDate(end)
    
    const validatedRange = this.validation.validateAndCorrectRange(parsedStart, parsedEnd)
    if (validatedRange) {
      this.state.setDateRange(validatedRange)
    }
  }

  setMinDate(date: Date | null) {
    this.state.setMinDate(date)
    this.validation.validate()
  }

  setMaxDate(date: Date | null) {
    this.state.setMaxDate(date)
    this.validation.validate()
  }

  setTimezone(timezone: string) {
    this.state.setTimezone(timezone)
  }

  setLocale(locale: Locale) {
    this.state.setLocale(locale)
  }

  setFormat(format: string) {
    this.state.setFormat(format)
  }

  toUTC() {
    return this.formatting.toUTC()
  }

  toLocal() {
    return this.formatting.toLocal()
  }

  validate() {
    return this.validation.validate()
  }

  reset() {
    this.state.reset()
  }

  clear() {
    this.state.clear()
  }
}
