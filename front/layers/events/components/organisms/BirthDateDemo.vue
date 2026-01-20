<script setup lang="ts">
import { useBirthDatePicker } from '../../composables/useBirthDatePicker'

const birthDate = useBirthDatePicker()

const demoDate = new Date('1990-05-15')

const setDemoDate = () => {
    birthDate.setDate(demoDate)
}

const clearDate = () => {
    birthDate.setDate(null)
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
                    <v-chip
                        v-if="birthDate.selectedDate?.value"
                        color="primary"
                        class="mr-2"
                    >
                        Date: {{ birthDate.formattedValue.value }}
                    </v-chip>
                    <v-chip v-else color="grey">Aucune date</v-chip>
                </v-col>

                <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">Informations:</div>
                    <v-list density="compact">
                        <v-list-item>
                            <template #prepend>
                                <v-icon
                                    :icon="birthDate.isValid.value ? 'mdi-check-circle' : 'mdi-alert-circle'"
                                    :color="birthDate.isValid.value ? 'success' : 'error'"
                                ></v-icon>
                            </template>
                            <v-list-item-title>
                                Valide: {{ birthDate.isValid.value ? 'Oui' : 'Non' }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="birthDate.error.value">
                            <template #prepend>
                                <v-icon icon="mdi-alert" color="error"></v-icon>
                            </template>
                            <v-list-item-title>
                                Erreur: {{ birthDate.error.value.message }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="birthDate.isoValue.value">
                            <template #prepend>
                                <v-icon icon="mdi-code-json"></v-icon>
                            </template>
                            <v-list-item-title>
                                ISO: {{ birthDate.isoValue.value }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-col>

                <v-col cols="12">
                    <v-btn color="primary" @click="setDemoDate" class="mr-2">
                        Définir 15/05/1990
                    </v-btn>
                    <v-btn color="error" @click="clearDate">
                        Réinitialiser
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
