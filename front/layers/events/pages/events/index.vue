<script setup lang="ts">
import BirthDateDemo from '../../components/organisms/BirthDateDemo.vue'
import EventDateTimeDemo from '../../components/organisms/EventDateTimeDemo.vue'
import AvailabilityRangeDemo from '../../components/organisms/AvailabilityRangeDemo.vue'
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <div class="d-flex align-center mb-4">
                    <v-btn icon="mdi-arrow-left" variant="text" to="/"></v-btn>
                    <div class="ml-4">
                        <h1 class="text-h4">DateTime Define - Démonstration</h1>
                        <p class="text-subtitle-1 text-medium-emphasis">
                            Exemples des 3 modes: date, datetime et range
                        </p>
                    </div>
                </div>
            </v-col>

            <v-col cols="12">
                <v-alert type="info" variant="tonal" class="mb-4">
                    <v-alert-title>Module datetime-define</v-alert-title>
                    Ce module fournit une API unifiée avec 3 modes:
                    <ul class="mt-2">
                        <li><strong>mode: 'date'</strong> - Sélection de date simple</li>
                        <li><strong>mode: 'datetime'</strong> - Date + heure combinées</li>
                        <li><strong>mode: 'range'</strong> - Période entre deux dates</li>
                    </ul>
                </v-alert>
            </v-col>

            <v-col cols="12" md="4">
                <BirthDateDemo />
            </v-col>

            <v-col cols="12" md="4">
                <EventDateTimeDemo />
            </v-col>

            <v-col cols="12" md="4">
                <AvailabilityRangeDemo />
            </v-col>

            <v-col cols="12">
                <v-card>
                    <v-card-title>Code exemple</v-card-title>
                    <v-card-text>
                        <v-code tag="pre">{{ codeExample }}</v-code>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
const codeExample = `// Mode Date
import { defineDateTime } from '~/modules/datetime-define/src'

export const useBirthDatePicker = defineDateTime('birth-date', {
    mode: 'date',
    format: 'dd/MM/yyyy',
    maxDate: new Date(),
    autoCorrect: true,
})

// Mode DateTime
export const useEventDateTimePicker = defineDateTime('event-datetime', {
    mode: 'datetime',
    format: 'dd/MM/yyyy HH:mm',
    minDate: new Date(),
    timezone: 'Europe/Paris',
})

// Mode Range
export const useAvailabilityRangePicker = defineDateTime('availability-range', {
    mode: 'range',
    format: 'dd/MM/yyyy',
    minDate: new Date(),
})

// Utilisation
const birthDate = useBirthDatePicker()
birthDate.setDate(new Date('1990-05-15'))
console.log(birthDate.formattedValue.value) // "15/05/1990"

const eventDateTime = useEventDateTimePicker()
eventDateTime.setDateTime(new Date(), '14:30')
console.log(eventDateTime.combinedDateTime.value)

const availability = useAvailabilityRangePicker()
availability.setDateRange(startDate, endDate)
console.log(availability.dateRange.value)
`
</script>
