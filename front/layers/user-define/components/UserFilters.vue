<script setup lang="ts">
const search = defineModel<string>('search', { required: true })
const gender = defineModel<string | null>('gender', { required: true })

defineEmits<{
    reset: []
}>()

const genderOptions = [
    { title: 'Homme', value: 'male' },
    { title: 'Femme', value: 'female' },
]
</script>

<template>
    <v-row class="mb-4">
        <v-col cols="12" md="6">
            <v-text-field
                v-model="search"
                label="Rechercher"
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
            />
        </v-col>
        <v-col cols="12" md="3">
            <v-select
                v-model="gender"
                :items="genderOptions"
                label="Genre"
                clearable
                hide-details
            />
        </v-col>
        <v-col cols="12" md="3" class="d-flex align-center">
            <v-btn variant="outlined" @click="$emit('reset')">
                Reinitialiser
            </v-btn>
        </v-col>
    </v-row>
</template>
