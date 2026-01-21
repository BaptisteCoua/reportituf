<script setup lang="ts">
import { computed } from 'vue'
import { useUserTable } from '../../composables/useUserTable'

const { items, page, itemsPerPage, sorts, search, filters, total, isLoading } = useUserTable()

const genderFilter = computed({
    get: () => (filters.value.gender as string) ?? null,
    set: (value: string | null) => {
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
                <UserDefineUserFilters
                    v-model:search="search"
                    v-model:gender="genderFilter"
                    @reset="resetFilters"
                />

                <UserDefineUserTable
                    v-model:page="page"
                    v-model:items-per-page="itemsPerPage"
                    v-model:sorts="sorts"
                    :items="items"
                    :total="total"
                    :is-loading="isLoading"
                />
            </v-card-text>
        </v-card>
    </v-container>
</template>
