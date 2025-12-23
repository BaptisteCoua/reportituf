<script setup lang="ts">
interface FormState {
  name: string
  email: string
  password: string
  avatar: string
  role: 'customer' | 'admin'
}

interface Props {
  modelValue: FormState
  errors: Partial<Record<keyof FormState, string>>
  showPassword?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: FormState): void
}

const props = withDefaults(defineProps<Props>(), {
  showPassword: true
})

const emit = defineEmits<Emits>()

const roleOptions = [
  { title: 'Customer', value: 'customer' },
  { title: 'Admin', value: 'admin' }
]

const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        :model-value="modelValue.name"
        :error-messages="errors.name"
        label="Name"
        variant="outlined"
        @update:model-value="updateField('name', $event)"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        :model-value="modelValue.email"
        :error-messages="errors.email"
        label="Email"
        type="email"
        variant="outlined"
        @update:model-value="updateField('email', $event)"
      />
    </v-col>
    <v-col v-if="showPassword" cols="12">
      <v-text-field
        :model-value="modelValue.password"
        :error-messages="errors.password"
        label="Password"
        type="password"
        variant="outlined"
        @update:model-value="updateField('password', $event)"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        :model-value="modelValue.avatar"
        :error-messages="errors.avatar"
        label="Avatar URL"
        variant="outlined"
        @update:model-value="updateField('avatar', $event)"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-select
        :model-value="modelValue.role"
        :items="roleOptions"
        label="Role"
        variant="outlined"
        @update:model-value="updateField('role', $event)"
      />
    </v-col>
  </v-row>
</template>
