import { defineDateTime } from '~/modules/datetime-define/src'

export const useBirthDatePicker = defineDateTime<[]>(() => ({
    mode: 'date',
    maxDate: new Date(),
}))
