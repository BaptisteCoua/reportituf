import { defineDateTime } from '~/modules/datetime-define/src'

export const useAvailabilityRangePicker = defineDateTime<[]>(() => ({
    mode: 'range',
    minDate: new Date(),
}))
