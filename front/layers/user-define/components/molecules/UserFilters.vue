<template>
  <v-row align="center" class="mb-4">
    <v-col cols="12" sm="6" md="4">
      <UserDefineSearchInput v-model="searchValue" />
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <UserDefineGenderSelect v-model="genderValue" />
    </v-col>
    <v-col cols="auto">
      <v-btn
        variant="outlined"
        size="small"
        @click="$emit('clear')"
      >
        Réinitialiser
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{
  search: string
  gender: string | undefined
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:gender': [value: string | undefined]
  'clear': []
}>()

const searchValue = computed({
  get: () => props.search,
  set: (value) => emit('update:search', value || '')
})

const genderValue = computed({
  get: () => props.gender,
  set: (value) => emit('update:gender', value)
})
</script>
