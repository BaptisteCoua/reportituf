<script setup lang="ts">
import { useAvailabilityRangePicker } from '../../composables/useAvailabilityRangePicker'

const availability = useAvailabilityRangePicker()

const nextWeek = new Date()
nextWeek.setDate(nextWeek.getDate() + 7)

const twoWeeksLater = new Date()
twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)

const setVacationRange = () => {
    availability.setDateRange(nextWeek, twoWeeksLater)
}

const clearRange = () => {
    availability.reset()
}
</script>

<template>
    <v-card>
        <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-calendar-range" class="mr-2"></v-icon>
            Mode Range - Période de disponibilité
        </v-card-title>

        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">Valeurs actuelles:</div>
                    <div class="d-flex gap-2 flex-wrap">
                        <v-chip
                            v-if="availability.startDate?.value"
                            color="success"
                            prepend-icon="mdi-calendar-start"
                        >
                            Début: {{ availability.formattedValue.value?.start }}
                        </v-chip>
                        <v-chip
                            v-if="availability.endDate?.value"
                            color="error"
                            prepend-icon="mdi-calendar-end"
                        >
                            Fin: {{ availability.formattedValue.value?.end }}
                        </v-chip>
                        <v-chip v-if="!availability.startDate?.value && !availability.endDate?.value" color="grey">
                            Aucune période définie
                        </v-chip>
                    </div>
                </v-col>

                <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">Informations:</div>
                    <v-list density="compact">
                        <v-list-item v-if="availability.dateRange?.value">
                            <template #prepend>
                                <v-icon icon="mdi-calendar-range"></v-icon>
                            </template>
                            <v-list-item-title>
                                Période: Du {{ availability.dateRange?.value.start?.toLocaleDateString('fr-FR') }}
                                au {{ availability.dateRange?.value.end?.toLocaleDateString('fr-FR') }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <template #prepend>
                                <v-icon
                                    :icon="availability.isValid.value ? 'mdi-check-circle' : 'mdi-alert-circle'"
                                    :color="availability.isValid.value ? 'success' : 'error'"
                                ></v-icon>
                            </template>
                            <v-list-item-title>
                                Valide: {{ availability.isValid.value ? 'Oui' : 'Non' }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="availability.error.value">
                            <template #prepend>
                                <v-icon icon="mdi-alert" color="error"></v-icon>
                            </template>
                            <v-list-item-title>
                                Erreur: {{ availability.error.value.message }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="availability.isoValue.value?.start">
                            <template #prepend>
                                <v-icon icon="mdi-code-json"></v-icon>
                            </template>
                            <v-list-item-title>
                                ISO: {{ availability.isoValue.value.start }} → {{ availability.isoValue.value.end }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-col>

                <v-col cols="12">
                    <v-btn color="success" @click="setVacationRange" class="mr-2">
                        Définir semaine prochaine
                    </v-btn>
                    <v-btn color="error" @click="clearRange">
                        Réinitialiser
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
