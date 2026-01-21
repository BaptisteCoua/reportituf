<script setup lang="ts">
import { useEventDateTimePicker } from '../../composables/useEventDateTimePicker'

const { date, time, combined, setDateTime, isValid, reset } = useEventDateTimePicker()

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

const setEventDateTime = () => {
    setDateTime(tomorrow, '14:30')
}

const clearDateTime = () => {
    reset()
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
                    <v-chip v-if="combined" color="secondary" class="mr-2">
                        {{ combined.toLocaleString('fr-FR') }}
                    </v-chip>
                    <v-chip v-else color="grey">Aucune date</v-chip>
                </v-col>

                <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">Details:</div>
                    <v-list density="compact">
                        <v-list-item v-if="date">
                            <template #prepend>
                                <v-icon icon="mdi-calendar"></v-icon>
                            </template>
                            <v-list-item-title>
                                Date: {{ date.toLocaleDateString('fr-FR') }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="time">
                            <template #prepend>
                                <v-icon icon="mdi-clock-outline"></v-icon>
                            </template>
                            <v-list-item-title>
                                Heure: {{ time }}
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
                        <v-list-item v-if="combined">
                            <template #prepend>
                                <v-icon icon="mdi-code-json"></v-icon>
                            </template>
                            <v-list-item-title>
                                ISO: {{ combined.toISOString() }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-col>

                <v-col cols="12">
                    <v-btn color="secondary" class="mr-2" @click="setEventDateTime">
                        Definir demain a 14h30
                    </v-btn>
                    <v-btn color="error" @click="clearDateTime">
                        Reinitialiser
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
