import { defineDateTime } from '~/modules/datetime-define/src'

export const useEventDateTimePicker = defineDateTime('event-datetime', {
    mode: 'datetime',
    format: 'dd/MM/yyyy HH:mm',
    minDate: new Date(),
    timezone: 'Europe/Paris',
})
