import { defineDateTime } from '~/modules/datetime-define/src'

export const useAvailabilityRangePicker = defineDateTime('availability-range', {
    mode: 'range',
    format: 'dd/MM/yyyy',
    minDate: new Date(),
})
