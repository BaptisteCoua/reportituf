import { defineDateTime } from '~/modules/datetime-define/src'

export const useBirthDatePicker = defineDateTime('birth-date', {
    mode: 'date',
    format: 'dd/MM/yyyy',
    maxDate: new Date(),
    autoCorrect: true,
})
