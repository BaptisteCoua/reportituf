<script setup lang="ts">
import type { User } from '../../types'
import type { DataTableHeader } from '../../../../modules/datatable-define/src/types'

interface FormState {
  name: string
  email: string
  password: string
  avatar: string
  role: 'customer' | 'admin'
}

interface Props {
  items: User[]
  headers: DataTableHeader[]
  loading: boolean
  page: number
  itemsPerPage: number
  totalItems: number
  search: string
  roleFilter: 'customer' | 'admin' | null
  dialogOpen: boolean
  form: FormState
  formErrors: Partial<Record<keyof FormState, string>>
  isEditing: boolean
  isSubmitting: boolean
}

interface Emits {
  (e: 'update:page', value: number): void
  (e: 'update:itemsPerPage', value: number): void
  (e: 'update:search', value: string): void
  (e: 'update:roleFilter', value: 'customer' | 'admin' | null): void
  (e: 'update:dialogOpen', value: boolean): void
  (e: 'update:form', value: FormState): void
  (e: 'sort', key: string): void
  (e: 'edit', user: User): void
  (e: 'delete', user: User): void
  (e: 'add'): void
  (e: 'submit'): void
  (e: 'cancel'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">Users</h1>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="$emit('add')"
          >
            Add User
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <UserFilters
              :search="search"
              :role="roleFilter"
              class="mb-4"
              @update:search="$emit('update:search', $event)"
              @update:role="$emit('update:roleFilter', $event)"
            />
            <UserTable
              :items="items"
              :headers="headers"
              :loading="loading"
              :page="page"
              :items-per-page="itemsPerPage"
              :total-items="totalItems"
              @update:page="$emit('update:page', $event)"
              @update:items-per-page="$emit('update:itemsPerPage', $event)"
              @sort="$emit('sort', $event)"
              @edit="$emit('edit', $event)"
              @delete="$emit('delete', $event)"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <UserFormDialog
      :model-value="dialogOpen"
      :form="form"
      :errors="formErrors"
      :is-editing="isEditing"
      :is-submitting="isSubmitting"
      @update:model-value="$emit('update:dialogOpen', $event)"
      @update:form="$emit('update:form', $event)"
      @submit="$emit('submit')"
      @cancel="$emit('cancel')"
    />
  </v-container>
</template>
