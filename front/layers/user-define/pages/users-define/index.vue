<template>
    <v-container fluid>
        <v-card>
            <v-card-title class="d-flex align-center">
                <v-icon start>mdi-account-group</v-icon>
                Utilisateurs (Approche Define)
                <v-spacer />
                <v-chip color="success" variant="tonal" size="small">
                    table-define
                </v-chip>
            </v-card-title>

            <v-card-text>
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
                            v-model="genderFilter"
                            :items="genderOptions"
                            label="Genre"
                            clearable
                            hide-details
                        />
                    </v-col>
                    <v-col cols="12" md="3" class="d-flex align-center">
                        <v-btn variant="outlined" @click="resetFilters">
                            Reinitialiser
                        </v-btn>
                    </v-col>
                </v-row>

                <v-data-table-server
                    v-model:page="page"
                    v-model:items-per-page="itemsPerPage"
                    v-model:sort-by="sorts"
                    :items="items"
                    :headers="headers"
                    :items-length="total"
                    :loading="isLoading"
                    class="elevation-1"
                >
                    <template #item.image="{ item }">
                        <v-avatar size="40">
                            <v-img :src="item.image" :alt="item.firstName" />
                        </v-avatar>
                    </template>

                    <template #item.gender="{ item }">
                        <v-chip
                            :color="item.gender === 'male' ? 'blue' : 'pink'"
                            size="small"
                            variant="tonal"
                        >
                            {{ item.gender === 'male' ? 'Homme' : 'Femme' }}
                        </v-chip>
                    </template>

                    <template #item.company.name="{ item }">
                        {{ item.company?.name || '-' }}
                    </template>

                    <template #bottom>
                        <v-divider />
                        <div class="d-flex align-center justify-space-between pa-4">
                            <div class="text-caption text-grey">
                                {{ total }} utilisateur(s) au total
                            </div>
                            <v-pagination
                                v-model="page"
                                :length="Math.ceil(total / itemsPerPage)"
                                :total-visible="5"
                                density="compact"
                            />
                        </div>
                    </template>
                </v-data-table-server>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserTable } from '../../composables/useUserTable'

const { items, page, itemsPerPage, sorts, search, filters, total, isLoading, reset } = useUserTable()

const headers = [
    { key: 'image', title: '', sortable: false, width: '60px' },
    { key: 'firstName', title: 'Prenom', sortable: true },
    { key: 'lastName', title: 'Nom', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'phone', title: 'Telephone', sortable: false },
    { key: 'age', title: 'Age', sortable: true },
    { key: 'gender', title: 'Genre', sortable: true },
    { key: 'company.name', title: 'Entreprise', sortable: false },
]

const genderOptions = [
    { title: 'Homme', value: 'male' },
    { title: 'Femme', value: 'female' },
]

const genderFilter = computed({
    get: () => filters.value.gender as string | undefined,
    set: (value) => {
        if (value) {
            filters.value = { ...filters.value, gender: value }
        } else {
            const { gender: _, ...rest } = filters.value
            filters.value = rest
        }
    },
})

const resetFilters = () => {
    search.value = ''
    filters.value = {}
}
</script>
