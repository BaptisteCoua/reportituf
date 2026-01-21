<script setup lang="ts">
import { useBirthDatePicker } from '../../composables/useBirthDatePicker'

const { date, setDate, isValid, reset } = useBirthDatePicker()

const demoDate = new Date('1990-05-15')

const setDemoDate = () => {
    setDate(demoDate)
}

const clearDate = () => {
    reset()
}
</script>

<template>
    <v-card>
        <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-cake-variant" class="mr-2"></v-icon>
            Mode Date - Date de naissance
        </v-card-title>

        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">Valeurs actuelles:</div>
                    <v-chip v-if="date" color="primary" class="mr-2">
                        Date: {{ date.toLocaleDateString('fr-FR') }}
                    </v-chip>
                    <v-chip v-else color="grey">Aucune date</v-chip>
                </v-col>

                <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">Informations:</div>
                    <v-list density="compact">
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
                        <v-list-item v-if="date">
                            <template #prepend>
                                <v-icon icon="mdi-code-json"></v-icon>
                            </template>
                            <v-list-item-title>
                                ISO: {{ date.toISOString() }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-col>

                <v-col cols="12">
                    <v-btn color="primary" class="mr-2" @click="setDemoDate">
                        Definir 15/05/1990
                    </v-btn>
                    <v-btn color="error" @click="clearDate">
                        Reinitialiser
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
