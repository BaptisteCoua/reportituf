<script setup lang="ts">
import { useEventDateTimePicker } from '../../composables/useEventDateTimePicker'

const eventDateTime = useEventDateTimePicker()

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

const setEventDateTime = () => {
    eventDateTime.setDateTime(tomorrow, '14:30')
}

const clearDateTime = () => {
    eventDateTime.reset()
}
</script>

<template>
    <v-card>
        <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-calendar-clock" class="mr-2"></v-icon>
            Mode DateTime - Rendez-vous
        </v-card-title>

        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">Valeurs actuelles:</div>
                    <v-chip
                        v-if="eventDateTime.selectedDate?.value"
                        color="secondary"
                        class="mr-2"
                    >
                        Date: {{ eventDateTime.formattedValue.value }}
                    </v-chip>
                    <v-chip v-else color="grey">Aucune date</v-chip>
                </v-col>

                <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">Détails:</div>
                    <v-list density="compact">
                        <v-list-item v-if="eventDateTime.selectedDate?.value">
                            <template #prepend>
                                <v-icon icon="mdi-calendar"></v-icon>
                            </template>
                            <v-list-item-title>
                                Date: {{ eventDateTime.selectedDate?.value?.toLocaleDateString('fr-FR') }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="eventDateTime.selectedTime?.value">
                            <template #prepend>
                                <v-icon icon="mdi-clock-outline"></v-icon>
                            </template>
                            <v-list-item-title>
                                Heure: {{ eventDateTime.selectedTime?.value }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="eventDateTime.combinedDateTime?.value">
                            <template #prepend>
                                <v-icon icon="mdi-calendar-clock"></v-icon>
                            </template>
                            <v-list-item-title>
                                Combiné: {{ eventDateTime.combinedDateTime?.value?.toLocaleString('fr-FR') }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <template #prepend>
                                <v-icon
                                    :icon="eventDateTime.isValid.value ? 'mdi-check-circle' : 'mdi-alert-circle'"
                                    :color="eventDateTime.isValid.value ? 'success' : 'error'"
                                ></v-icon>
                            </template>
                            <v-list-item-title>
                                Valide: {{ eventDateTime.isValid.value ? 'Oui' : 'Non' }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="eventDateTime.isoValue.value">
                            <template #prepend>
                                <v-icon icon="mdi-code-json"></v-icon>
                            </template>
                            <v-list-item-title>
                                ISO: {{ eventDateTime.isoValue.value }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-col>

                <v-col cols="12">
                    <v-btn color="secondary" @click="setEventDateTime" class="mr-2">
                        Définir demain à 14h30
                    </v-btn>
                    <v-btn color="error" @click="clearDateTime">
                        Réinitialiser
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
