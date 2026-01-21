import { defineDateTime } from '~/modules/datetime-define/src'

export const useEventDateTimePicker = defineDateTime<[]>(() => ({
    mode: 'datetime',
    minDate: new Date(),
}))
