<script setup lang="ts">
import type { User } from '../types'

const props = defineProps<{
    items: User[]
    total: number
    isLoading: boolean
}>()

const page = defineModel<number>('page', { required: true })
const itemsPerPage = defineModel<number>('itemsPerPage', { required: true })
const sorts = defineModel<{ key: string; order: 'asc' | 'desc' }[]>('sorts', { required: true })

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

const totalPages = computed(() => Math.ceil(props.total / itemsPerPage.value))
</script>

<template>
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
                    :length="totalPages"
                    :total-visible="5"
                    density="compact"
                />
            </div>
        </template>
    </v-data-table-server>
</template>
