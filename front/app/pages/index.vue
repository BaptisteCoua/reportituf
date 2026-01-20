<script setup lang="ts">
const domains = [
  {
    title: 'Users',
    description: 'User management using datatable-define and datetime-define modules',
    icon: 'mdi-account-group',
    to: '/users',
    color: 'primary',
    approach: 'Define (Functional)'
  },
  {
    title: 'Products',
    description: 'Product catalog using datatable-v2 and date-time-picker modules',
    icon: 'mdi-package-variant-closed',
    to: '/products',
    color: 'secondary',
    approach: 'POO (Classes)'
  },
  {
    title: 'DateTime Demo',
    description: 'Demonstration of datetime-define module with 3 modes',
    icon: 'mdi-calendar-clock',
    to: '/events',
    color: 'success',
    approach: 'Define (Functional)'
  }
]
</script>

<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" class="text-center mb-8">
        <h1 class="text-h3 mb-4">DDD Demo Project</h1>
        <p class="text-body-1 text-medium-emphasis">
          Compare two approaches: Define (Functional) vs POO (Object-Oriented)
        </p>
      </v-col>

      <v-col v-for="domain in domains" :key="domain.title" cols="12" md="5">
        <v-card
          :to="domain.to"
          :color="domain.color"
          variant="tonal"
          height="200"
          class="d-flex flex-column justify-center align-center"
        >
          <v-icon :icon="domain.icon" size="48" class="mb-4" />
          <v-card-title class="text-h5">{{ domain.title }}</v-card-title>
          <v-card-subtitle>{{ domain.approach }}</v-card-subtitle>
          <v-card-text class="text-center">
            {{ domain.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
