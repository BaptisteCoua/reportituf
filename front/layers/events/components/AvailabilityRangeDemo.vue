<script setup lang="ts">
import { useAvailabilityRangePicker } from '../../composables/useAvailabilityRangePicker'

const { start, end, setRange, isValid, reset } = useAvailabilityRangePicker()

const nextWeek = new Date()
nextWeek.setDate(nextWeek.getDate() + 7)

const twoWeeksLater = new Date()
twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)

const setVacationRange = () => {
    setRange(nextWeek, twoWeeksLater)
}

const clearRange = () => {
    reset()
}
</script>

<template>
    <v-card>
        <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-calendar-range" class="mr-2"></v-icon>
            Mode Range - Periode de disponibilite
        </v-card-title>

        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">Valeurs actuelles:</div>
                    <div class="d-flex gap-2 flex-wrap">
                        <v-chip v-if="start" color="success" prepend-icon="mdi-calendar-start">
                            Debut: {{ start.toLocaleDateString('fr-FR') }}
                        </v-chip>
                        <v-chip v-if="end" color="error" prepend-icon="mdi-calendar-end">
                            Fin: {{ end.toLocaleDateString('fr-FR') }}
                        </v-chip>
                        <v-chip v-if="!start && !end" color="grey">
                            Aucune periode definie
                        </v-chip>
                    </div>
                </v-col>

                <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">Informations:</div>
                    <v-list density="compact">
                        <v-list-item v-if="start && end">
                            <template #prepend>
                                <v-icon icon="mdi-calendar-range"></v-icon>
                            </template>
                            <v-list-item-title>
                                Periode: Du {{ start.toLocaleDateString('fr-FR') }}
                                au {{ end.toLocaleDateString('fr-FR') }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <template #prepend>
                                <v-icon
                                    :icon="isValid ? 'mdi-check-circle' : 'mdi-alert-circle'"
                                    :color="isValid ? 'success' : 'error'"
                                ></v-icon>
                            </template>
                            <v-list-item-title>
                                Valide: {{ isValid ? 'Oui' : 'Non' }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-col>

                <v-col cols="12">
                    <v-btn color="success" class="mr-2" @click="setVacationRange">
                        Definir semaine prochaine
                    </v-btn>
                    <v-btn color="error" @click="clearRange">
                        Reinitialiser
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
