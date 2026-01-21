<script setup lang="ts">
interface FormState {
  name: string
  email: string
  password: string
  avatar: string
  role: 'customer' | 'admin'
}

interface Props {
  modelValue: boolean
  form: FormState
  errors: Partial<Record<keyof FormState, string>>
  isEditing: boolean
  isSubmitting: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:form', value: FormState): void
  (e: 'submit'): void
  (e: 'cancel'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>
        {{ isEditing ? 'Edit User' : 'Add User' }}
      </v-card-title>
      <v-card-text>
        <UserFormFields
          :model-value="form"
          :errors="errors"
          :show-password="!isEditing"
          @update:model-value="$emit('update:form', $event)"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          :disabled="isSubmitting"
          @click="$emit('cancel')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="isSubmitting"
          @click="$emit('submit')"
        >
          {{ isEditing ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
